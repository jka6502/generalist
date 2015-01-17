(function(root) {
	'use strict';


	var Node		= require('./node'),
		AST			= require('./ast'),

		Assignable	= Node.Abstract.Assignable,
		Expression	= Node.Abstract.Expression;


	var	Variable		= Assignable.extend({

			type:		'Variable',
			
			abstract:	true,

			args:		[{ name: 'name', type: String, optional: true }],

			toSource: function(scope) {
				return this.name;
			},

			setParent: function(parent) {
				this.parent = this.parent || parent;
			}

		}),

		ArrayElement	= Assignable.extend({

			type:		'ArrayElement',

			args:		[
				{ name: 'variable', type: Variable },
				{ name: 'index', type: Expression }
			],

			toSource: function(scope) {
				return this.variable.toSource(scope)
					+ '[' + this.index.toSource(scope) + ']';
			}

		}),

		Property		= Assignable.extend({

			type:		'Property',

			args:		[

				{ name: 'variable', type: Variable },
				{ name: 'property', type: String }

			],

			toSource: function(scope) {
				return this.variable.toSource(scope) + '.' + this.property;
			}

		});

	Variable.extend({ type: 'GlobalVariable' });

	Variable.extend({

		type: 'LocalVariable',

		toSource: function(scope) {
			scope.registerLocalVariable(this);
			return this.name;
		}

	});


})();
