const { userTable,RelativesTable } = require("../../../models/index");
const fileExportFunction = require("../../../documents/file_exports");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;


async function _createRelative(req) {
    const userId = req.body.user_id;
    const relative = req.body;
    const attachments=[]
    if (req.files) {
      for (let file of req.files) {
          attachments.push({ name: file.originalname, url: file.location });
      }
  }
  req.body.profile_image = attachments;
    // if (req.file) {
    //   relative.profile_image = req.file.location
    // }
  
    const user = await userTable.findOne({ where: { user_id: userId } });
  
    if (!user) {
      throw "User does not exist!";
    }
  
    const createdRelative = await RelativesTable.create(relative);
    await createdRelative.save();
    return createdRelative;
  }

async function _getAllRelatives(req) {
    let {limit,page,user_id}=req.query
    limit = limit ? limit : 100;
    page = page ? page : 1;
    let offset = (page - 1) * limit;
    let whereCondition = { is_deleted: false };
    if(user_id){
        whereCondition.user_id=user_id
    }
    const relative=await RelativesTable.findAll({
        where: whereCondition,
        include: [{ model: userTable}],
        order: [["rel_id", "ASC"]],
        limit:limit,
        offset:offset
      });
    return relative
}

async function _updateRelative(req) {
    let Relative = await RelativesTable.findOne({
      where: { rel_id:req.params.id},
    });
    if (!Relative) {
      throw "No Data found!";
    }
    return await RelativesTable.update(req.body, {
      where: { rel_id:req.params.id },
    });
  }

  async function _deleteRelative(req) {
    let Relative = await RelativesTable.findOne({
      where: { rel_id:req.params.id},
    });
    if (!Relative) {
      throw "No Data found!";
    }
    req.body.is_deleted = true;
    return await RelativesTable.update(req.body, {
      where: { rel_id:req.params.id },
    });
  }
async function _exportRelatives(){
    const whereCondition={is_deleted:false}
    const results = await RelativesTable.findAll({
        order: [["updatedAt", "DESC"]],
        where: whereCondition,
        include: [
          {
            model: userTable,
            attributes: ["firstName","lastName","unit_number"],
            
          }],
          
    })
    console.log("uuuuuuuuuuuu",results)
    const data=[]
    for (let i = 0; i < results.length; i++) {
        let obj = {
            rel_firstName:results[i].firstName,
            rel_lastName:results[i].lastName,
            relation:results[i].relation,
            user_name:results[i].user.firstName,
            unit:results[i].user.unit_number
        }
        data.push(obj)
    file_url = await fileExportFunction(data, "relatives");
    return { file_url };
}
}

module.exports={
    _createRelative,
    _getAllRelatives,
    _updateRelative,
    _deleteRelative,
    _exportRelatives

}
