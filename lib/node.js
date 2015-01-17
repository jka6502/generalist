(function(root) {
	'use strict';


	var extend = require('../node_modules/stratum-framework/lib/extend');


	var Node = extend(function Node() {

		throw new Error('Node is abstract, use a sub class');

	}, {

		create: function() {},

		toSource: function(scope) {},

		setParent: function(parent) {
			this.parent = parent;
		}

	});


	Node.Abstract = {};
	Node.Classes = {};


	Node.Array = function Array(elementType, min, max) {
		if (!(this instanceof Node.Array)) {
			return new Node.Array(elementType);
		}

		this.elementType = elementType;
		this.min = min;
		this.max = max;
	};


	var Validation = extend(function Validation() {

		this.types	= [];
		this.source	= '';

	}, {


		add: function(definition) {
			this.type(definition.name, definition.type, definition.optional);
		},

		type: function(name, type, optional, depth) {
			var param = 'TYPE_' + this.types.length;

			if (!optional) {
				this.source += 'if (' + name + ' === undefined) {'
					+ this.throw('Argument \'' + name + '\' must be supplied')
					+ '};';
			}

			if (!type) { return; }

			var condition = '!(' + name + ' instanceof ' + param + ')';

			if (type instanceof Node.Array) {
				return this.array(name, type, depth || 0, type.min, type.max);
			}

			if (type === String) {
				condition = '(typeof ' + name + ' !== \'string\')';
			}else if (type === Number) {
				condition = '(typeof ' + name + ' !== \'number\')';
			}else if (type === Boolean) {
				condition = '(typeof ' + name + ' !== \'boolean\')';
			}

			this.types.push([param, type]);

			this.source += 'if ('
				+ (optional ? (name + ' && ') : '')
				+ condition + ') {'
				+ this.throw('Argument \'' + name + '\' must be a'
					+ ("aeoiu".indexOf(type.name[0].toLowerCase()) != -1 ? 'n ' : ' ')
				+ type.name) + '}';
		},

		array: function(name, type, depth, min, max) {

			this.source += 'if (' + name + ') {';

			this.source += 'if(!Array.isArray(' + name + '))'
				+ this.throw('Argument ' + name + ' must be an Array');

			if (min) {
				this.source += 'if (' + name + '.length < ' + min + ') '
				+ this.throw('Argument ' + name + ' must contain at least '
					+ min + ' elements.');
			}

			if (max) {
				this.source += 'if (' + name + '.length > ' + max + ') '
				+ this.throw('Argument ' + name + ' must contain no more than '
					+ max + ' elements.');
			}

			this.source += '}';

			if (!type) { return; }

			var index	= 'index' + depth,
				length	= 'length' + depth;

			this.source += 'for(var ' + index + ' = 0, '
				+ length + ' = ' + name + '.length; '
				+ index + ' < ' + length + '; ' + index + '++) {';

			this.type(name + '[' + index + ']', type.type, depth + 1);

			this.source += '}';

		},

		throw: function(message, type) {
			type = type || 'Error';
			return 'throw new ' + type
				+ '(\'' + message.replace(/\'/g, '\\\'') + '\');';
		}


	});


	Node.extend = function(options) {
		var validation	= new Validation(),
			type		= options.type,
			names		= [],
			storage		= '',
			typeNames	= [],
			types		= [],
			abstract	= options.hasOwnProperty('abstract') && options.abstract,
			body		= '';


		if (abstract) {

			body = '\'use strict\'; return function '
				+ type + '() { throw new Error(\''
				+ type + ' is abstract, use a sub class\'); }'

		}else{

			(options.args || this.prototype.args || []).forEach(function(arg) {
				validation.add(arg);

				names.push(arg.name);

				if (arg.store !== false) {
					storage += 'this.' + arg.name + ' = ' + arg.name + ';';
					if (arg.type && arg.type.prototype instanceof Node) {
						storage += arg.name + '.setParent(this);';
					}
				}
			});


			validation.types.forEach(function(array) {
				typeNames.push(array[0]);
				types.push(array[1]);
			});

			var body = '\'use strict\'; return function '
				+ type + '(' + names.join(',') + ') {'
				+ 'if (!(this instanceof ' + type + ')) return new ' + type
				+ '(' + names.join(',') + '); ' + validation.source + storage
				+ 'this.create(); return this; }';
		}

		typeNames.push(body);

		var constructor	= Function.apply(null, typeNames).apply(null, types);

		console.log(constructor);

		constructor			= extend(constructor, this, options);
		constructor.extend	= this.extend;

		if (abstract) {
			Node.Abstract[type] = constructor;
		}else{
			Node.Classes[type] = constructor;
		}

		return constructor;
	};


	module.exports = window.GeneralistNode = Node;


})();