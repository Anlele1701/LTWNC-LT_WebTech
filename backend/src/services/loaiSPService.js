const hangModel = require('../models/hangModel')
var loaiSPModel=require('../models/loaiSPModel')
var hangService=require('../services/hangService')
var sanPhamService=require('../services/sanPhamService')

var listIDSP=[]
var cateID=''

//tìm các sp theo loại sp và hãng của sp
var getProductsOfCompany=async(tenLoaiSP, idHang)=>{
    try{
        
        var listItem=await loaiSPModel.findOne({tenLoai:tenLoaiSP}).then(document=>{
            var itemHang=document.cacHang.forEach(element => {
                if(element.idHang===idHang)
                {
                    listIDSP=element.idCacSP
                }
            });
        })
        return listIDSP
    }
    catch(error){
        console.error(error)
    }
}

//tìm id của loại sp
var findCateID=async(tenLoaiSP)=>{
    try{
        const idLoaiSP=await loaiSPModel.findOne({tenLoai:tenLoaiSP}).then(document=>{
            cateID=document.id
            return idLoaiSP
        })
    }catch(error)
    {
        console.error(error)
    }
}


//thêm loại sản phẩm vào hãng
var createnewLoaiSPtoHang=async(sp)=>{
    try{
        var item=hangModel.findById(sp.idHang).then((document)=>{
            document.cacLoaiSP.push(sp.tenloaiSP)
            document.save()
            sanPhamService.createNewCateProduct(sp)
            return document
        })
        return item
        
    }catch(error)
    {
        console.error(error)
    }
}
module.exports={listIDSP,getProductsOfCompany,findCateID,cateID, createnewLoaiSPtoHang}