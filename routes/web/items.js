var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('../../config/connect')();

/* GET users listing. */
router.get('/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var sqlQuery = 'SELECT * FROM [SPM_Database].[dbo].[UnionInventory] ORDER BY ItemNumber DESC';
			var request = new sql.Request(conn);
			request
				.query(sqlQuery)
				.then(function(result) {
					conn.close();
					res.render('items/index', {
						route: 'Items',
						data: result.recordset
					});
					res.end();
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching users data');
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.end();
			res.render('error', {
				route: 'error',
				err: err
			});
		});
});

router.get('/info/:id/', function(req, res, next) {
	conn
		.connect()
		.then(function() {
			var sqlQuery = 'SELECT * FROM [SPM_Database].[dbo].[UnionInventory] where ItemNumber=@id';
			var request = new sql.Request(conn);
			request.input('id', sql.VarChar, req.params.id);
			request
				.query(sqlQuery)
				.then(function(result) {
					conn.close();
					res.render('items/info', {
						route: 'info',
						data: result.recordset[0]
					});
					console.log('Completed request for item id: ' + req.params.id);
				})
				.catch(function(err) {
					console.log(err);
					conn.close();
					res.status(400).send('Error while fetching items data with id');
				});
		})
		.catch(function(err) {
			console.log(err);
			conn.close();
			res.render('error', {
				route: 'error',
				err: err
			});
			// res.send('Error while requesting users data with id: ' + req.params.id);
		});
});

module.exports = router;
