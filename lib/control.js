(function(root) {
	'use strict';


	var Node		= require('./node'),
		AST			= require('./ast'),

		Expression	= Node.Abstract.Expression,
		Statement	= Node.Abstract.Statement,
		Variable	= Node.Abstract.Variable;


	Statement.extend({

		type: 'Block',

		args: [
			{ name: 'statements', type: Node.Array(Statement), optional: true }
		],

		toSource: function() {
			return '{' + this.statements.map(function(statement) { return statement.toSource(); }).join('') + '}';
		},

	});

	Statement.extend({

		type: 'If',

		args: [
			{ name: 'condition', type: Expression },
			{ name: 'then', type: Statement },
			{ name: 'otherwise', type: Statement, optional: true }
		],

		toSource: function(scope) {
			return 'if (' + this.condition.toSource(scope) + ') '
				+ this.then.toSource(scope)
				+ (this.otherwise
					? (' else ' + this.otherwise.toSource(scope))
					: '')
				+ ';';
		}

	});

	Statement.extend({

		type: 'For',

		args: [
			{ name: 'initial',		type: Expression },
			{ name: 'condition',	type: Expression },
			{ name: 'step',			type: Statement },
			{ name: 'statement',	type: Statement }
		],

		toSource: function(scope) {
			return 'for(' + this.initial.toSource(scope) + ';'
				+ this.condition + ';'
				+ this.step.toSource(scope) + ') '
				+ this.statement.toSource(scope);
		}

	});

	Statement.extend({

		type: 'ForIn',

		args: [
			{ name: 'variable',		type: Variable },
			{ name: 'expression',	type: Expression },
			{ name: 'statement',	type: Statement }
		],

		toSource: function(scope) {
			return 'for(' + this.variable.toSource(scope) + ' in '
				+ this.expression + ') ' + this.statement.toSource(scope);
		}

	});

	Statement.extend({

		type: 'While',

		args: [
			{ name: 'condition', type: Expression },
			{ name: 'statement', type: Statement }
		],

		toSource: function(scope) {
			return 'while(' + this.condition.toSource(scope) + ') '
				+ this.statement.toSource(scope);
		}

	});

	Statement.extend({

		type: 'DoWhile',

		args: [
			{ name: 'statement', type: Statement },
			{ name: 'condition', type: Expression }
		],

		toSource: function(scope) {
			return 'do ' + this.statement.toSource(scope) + ' while('
				+ this.condition.toSource(scope) + ')';
		}

	});

	var Case = Statement.extend({

		type: 'Case',

		args: [
			{ name: 'condition', type: Expression },
			{ name: 'Statement', type: Statement }
		],

		toSource: function(scope) {
			return 'case ' + this.condition.toSource(scope) + ': '
				+ this.statement.toSource(scope) + ')';
		}

	});

	var Default = Statement.extend({

		type: 'Default',

		args: [
			{ name: 'Statement', type: Statement }
		],

		toSource: function(scope) {
			return 'default: ' + this.statement.toSource(scope) + ')';
		}

	});

	Statement.extend({

		type: 'Switch',

		args: [
			{ name: 'expression', type: Expression },
			{ name: 'cases', type: Node.Array(Case, 1) },
			{ name: 'defaultCase', type: Default, optional: true }
		],

		toSource: function(scope) {
			return 'switch(' + this.expression.toSource(scope) + ') {'
				+ this.cases.map(function(option) {
						return option.toSource(scope);
					}).join(';');
				+ this.defaultCase ? this.defaultCase.toSource(scope) : ''
				+ '}';
		}

	});

	Statement.extend({

		type: 'Return',

		args: [
			{ name: 'expression', type: Expression, optional: true }
		],

		toSource: function(scope) {
			return 'return ' + (this.expression
					? this.expression.toSource(scope)
					: '')
				+ ';';
		}

	});


	var Label = Statement.extend({

		type: 'Label',

		args: [
			{ name: 'label', type: String }
		],

		toSource: function(scope) {
			return this.label + ':';
		},

		setParent: function(parent) {
			if (parent instanceof Break || parent instanceof Continue) {
				return;
			}
			this.parent = parent;
		}

	});

	var Break = Statement.extend({

		type: 'Break',

		args: [
			{ name: 'label', type: Label, optional: true }
		],

		toSource: function(scope) {
			return 'break' + (this.label ? (' ' + this.label + ':') : '') + ';';
		}

	});

	var Continue = Statement.extend({

		type: 'Continue',

		args: [
			{ name: 'label', type: Label, optional: true }
		],

		toSource: function(scope) {
			return 'continue' + (this.label ? (' ' + this.label + ':') : '') + ';';
		}

	});

	Statement.extend({

		type: 'Delete',

		args: [
			{ name: 'expression', type: Expression }
		],

		toSource: function(scope) {
			return 'delete' + expression.toSource(scope) + ';';
		}

	});



})();
