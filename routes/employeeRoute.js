const upload=require('../middleWare/multer')
const express=require('express')
const{all_employees,add_employee,get_employee,update_employee,del_employee,viewHome,postavatar,profilepage,logout}=require('../controllers/emplyController')
const router=express.Router();

const authentication = require('../middleWare/authentication');

// router.use(authentication);

router.route("/dashboard").get(authentication,viewHome)

router.route("/profilepage.html?").get(profilepage)
router.route('/').get(all_employees).post(add_employee);


router.route('/:id').get(get_employee).put(update_employee).delete(del_employee);

router.post('/:id/avatar', upload.single('avatar'),postavatar);

router.route("/logout").post(logout);



module.exports=router