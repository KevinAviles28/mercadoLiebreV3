const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	root: (req, res) => {
		let insale=products.filter((producto)=>{
		return	producto.category==='in-sale'
		})
		let visited=products.filter((producto)=>{
		return 	producto.category==='visited'
		})
		let precioReal=function(producto){
			return  (producto.price-(producto.price*producto.discount/100)).toFixed(0).toString().replace( /\B(?=(\d{3})+(?!\d))/g,
			"." );
		 }


		res.render('index',{
			title:'home',
			insale,
			visited,
			precioReal
		})
	},
	search: (req, res) => {
		// Do the magic
	},
};

module.exports = controller;
