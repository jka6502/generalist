(function(root) {
	'use strict';


	var Node	= require('./node');


	var Statement	= Node.extend({ type: 'Statement', abstract: true }),
		Expression	= Statement.extend({ type: 'Expression', abstract: true });

	Expression.extend({ type: 'Assignable', abstract: true }),
	Expression.extend({ type: 'Operator', abstract: true });


})();