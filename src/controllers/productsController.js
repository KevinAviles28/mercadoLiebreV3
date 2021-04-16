const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	root: (req, res) => {

		let precioReal=function(producto){
			return  (producto.price-(producto.price*producto.discount/100)).toFixed(0).toString().replace( /\B(?=(\d{3})+(?!\d))/g,
			"." );
		 }
		res.render('products',{
			products,
			precioReal

		})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let product = products.find(element => element.id === +req.params.id);

		let precioReal=function(producto){
			return  (producto.price-(producto.price*producto.discount/100)).toFixed(0).toString().replace( /\B(?=(\d{3})+(?!\d))/g,
			"." );
		 }

		res.render('detail',{
			product,
			precioReal
		})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render('product-create-form');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const{name,price,discount,category,description}=req.body;
		let lastId = 0;
            
            products.forEach(element=>{
                if(element.id > lastId){
                    return lastId = element.id;
                }
            });
			const newProduct={
				id:+lastId+1,
				name:name,
				price:price,
				discount:discount,
				category:category,
				description:description
			}
			products.push(newProduct)
			fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8');
			res.redirect('/');

	},

	// Update - Form to edit
	edit: (req, res) => {
	let productoo=products.find(producto=>{
			return 	producto.id===+req.params.id
		})
		res.render('product-edit-form',{
			productoo
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const{name,price,discount,category,description}=req.body;
		products.forEach(producto=>{
			if(producto.id===Number(req.params.id)){
				producto.name=name,
				producto.price=price,
				producto.discount=discount,
				producto.category=category,
				producto.description=description
			}
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2),'utf-8');
		res.redirect('/');
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(producto => {
			if(producto.id===Number(req.params.id)){
				if(fs.existsSync(path.join('public','images','productos',producto.img))){
                    fs.unlinkSync(path.join('public','images','productos',producto.img))
                }
				let idEliminado=products.indexOf(producto)
				products.splice(idEliminado,1);
			}
		});
		fs.writeFileSync(productsFilePath,JSON.stringify(products,null,2))
		res.redirect('/');
	}
};

module.exports = controller;