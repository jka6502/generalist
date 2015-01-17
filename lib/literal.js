(function(root) {
	'use strict';


	var Node		= require('./node'),
		AST			= require('./ast'),

		Expression	= Node.Abstract.Expression;


	var Literal			= Expression.extend({

			type: 'Literal',

			abstract: true,

			toSource: function() {
				return String(this.value);
			},

			setParent: function(parent) {}

		}),

		StringLiteral	= Literal.extend({

			type: 'StringLiteral',

			args: [{ name: 'value', type: String }],

			toString: function(scope) {
				return '\'' + this.value.replace(/\'/g, '\\\'') + '\'';
			}

		}),

		NumberLiteral	= Literal.extend({

			type: 'NumberLiteral',

			args: [{ name: 'value', type: Number }]

		}),

		BooleanLiteral	= Literal.extend({

			type: 'BooleanLiteral',

			args: [{ name: 'value', type: Boolean }]

		});

		BooleanLiteral.TRUE = new BooleanLiteral(true),
		BooleanLiteral.FALSE = new BooleanLiteral(false)

		NumberLiteral.ZERO = new NumberLiteral(0),
		NumberLiteral.ONE = new NumberLiteral(1);


})();
