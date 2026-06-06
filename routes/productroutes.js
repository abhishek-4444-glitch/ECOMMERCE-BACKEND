const {Router}=require('express');
const {getproduct,createproduct,updateproduct,deleteproduct, bulkinsert}=require('../controllers/productscontroller')
let router=Router();
router.post('/',createproduct)
router.post('/bulk',bulkinsert)
router.get('/',getproduct)
router.put('/:id',updateproduct)
router.delete('/:id',deleteproduct)
module.exports=router
