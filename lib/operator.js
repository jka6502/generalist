(function(root) {
	'use strict';


	var Node		= require('./node'),
		AST			= require('./ast'),

		Operator	= Node.Abstract.Operator,
		Assignable	= Node.Abstract.Assignable,
		Expression	= Node.Abstract.Expression;


	var EXPRESSION	= { name: 'first', type: Expression },
		ASSIGN		= { name: 'first', type: Assignable },
		LEFT		= { name: 'first', type: Expression },
		RIGHT		= { name: 'second', type: Expression };


	var	Unary = Operator.extend({

			type: 'Unary',

			abstract: true,

			args: [ EXPRESSION ],

			toSource: function(scope) {
				return '(' + this.operator + this.first.toSourcescope() + ')';
			}

		}),

		PostFixUnary = Unary.extend({

			type: 'PostFixUnary',

			abstract: true,

			toSource: function(scope) {
				return '(' + this.first.toSource(scope) + this.operator + ')';
			}

		}),

		Binary = Operator.extend({

			type: 'Binary',

			abstract: true,

			args: [ LEFT, RIGHT ],

			toSource: function(scope) {
				return '(' + this.first.toSource(scope)
					+ this.operator
					+ this.second.toSource(scope) + ')';
			}

		}),

		UnaryAssign = Unary.extend({

			type:		'UnaryAssign',

			abstract:	true,

			args:		[ ASSIGN ]

		}),

		PostFixUnaryAssign = PostFixUnary.extend({

			type:		'PostFixUnaryAssign',

			abstract:	true,

			args:		[ ASSIGN ]

		}),

		BinaryAssign = Binary.extend({

			type:		'BinaryAssign',

			abstract:	true,

			args:		[ ASSIGN, RIGHT ]

		});


	Binary.extend({ type: 'Xor', operator: '^' }),

	Unary.extend({ type: 'BitwiseNot', operator: '~' }),
	Binary.extend({ type: 'BitwiseAnd', operator: '&' }),
	Binary.extend({ type: 'BitwiseOr', operator: '|' }),

	Unary.extend({ type: 'LogicalOr', operator: '!' }),
	Binary.extend({ type: 'LogicalOr', operator: '||' }),
	Binary.extend({ type: 'LogicalAnd', operator: '&&' }),

	Unary.extend({ type: 'Negate', operator: '-' }),
	Binary.extend({ type: 'Add', operator: '+' }),
	Binary.extend({ type: 'Subtract', operator: '-' }),
	Binary.extend({ type: 'Multiply', operator: '*' }),
	Binary.extend({ type: 'Divide', operator: '/' }),
	Binary.extend({ type: 'Modulus', operator: '%' }),

	Binary.extend({ type: 'ShiftLeft', operator: '<<' }),
	Binary.extend({ type: 'ZeroShiftRight', operator: '>>' }),
	Binary.extend({ type: 'ArithmeticShiftRight', operator: '>>' }),


	UnaryAssign.extend({ type: 'PreIncrement', operator: '++' }),
	UnaryAssign.extend({ type: 'PreDecrement', operator: '--' }),
	PostFixUnaryAssign.extend({	type: 'PostIncrement', operator: '++' }),
	PostFixUnaryAssign.extend({	type: 'PostDecrement', operator: '--' }),

	BinaryAssign.extend({ type: 'AssignXor', operator: '~=' }),
	BinaryAssign.extend({ type: 'AssignAnd', operator: '&=' }),
	BinaryAssign.extend({ type: 'AssignOr', operator: '|=' }),

	BinaryAssign.extend({ type: 'AssignAdd', operator: '+=' }),
	BinaryAssign.extend({ type: 'AssignSubtract', operator: '-=' }),
	BinaryAssign.extend({ type: 'AssignMultiply', operator: '*=' }),
	BinaryAssign.extend({ type: 'AssignDivide', operator: '/=' }),
	BinaryAssign.extend({ type: 'AssignModulus', operator: '%=' }),

	BinaryAssign.extend({ type: 'AssignShiftLeft', operator: '<<=' }),
	BinaryAssign.extend({ type: 'AssignZeroShiftRight',	operator: '>>>=' }),
	BinaryAssign.extend({ type: 'AssignArithmeticShiftRight', operator: '>>=' });


	Binary.extend({ type: 'Equal', operator: '==' });
	Binary.extend({ type: 'NotEqual', operator: '!=' });
	Binary.extend({ type: 'Identity', operator: '===' });
	Binary.extend({ type: 'NotIdentity', operator: '!==' });
	Binary.extend({ type: 'GreaterThan', operator: '>' });
	Binary.extend({ type: 'LessThan', operator: '<' });
	Binary.extend({ type: 'GreaterThanOrEqual', operator: '>=' });
	Binary.extend({ type: 'LessThanOrEqual', operator: '<=' });


	Binary.extend({ type: 'In', operator: ' in ' });
	Binary.extend({ type: 'InstanceOf', opterator: ' instanceof ' });
	Unary.extend({ type: 'TypeOf', opterator: 'typeof ' });
	Unary.extend({ type: 'Void', opterator: 'void ' });


	Operator.extend({

		type: 'Ternary',

		args: [
			{ name: 'condition', type: Expression },
			{ name: 'then', type: Expression },
			{ name: 'otherwise', type: Expression }
		],

		toSource: function(scope) {
			return this.condition.toSource(scope)
				+ ' ? ' + this.then.toSource(scope)
				+ ' : ' + this.otherwise.toSource(scope);
		}

	});



})();
