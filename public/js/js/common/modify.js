function Modify(details ){ 
    this.details = details;
    this.init();
}

Modify.Template = `
<div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 class="modal-title">修改公司信息</h4>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="Modify-company-name">公司名称</label>
                                    <input type="email" class="form-control" id="Modify-company-name" placeholder="请输入公司名称">
                                </div>
                                <div class="form-group">
                                    <label for="Modify-company-scale">公司规模</label>
                                    <input type="email" class="form-control" id="Modify-company-scale" placeholder="请输入公司规模">
                                </div>
                                <div class="form-group">
                                    <label for="Modify-company-synopsis">公司简介</label>
                                    <input type="email" class="form-control" id="Modify-company-synopsis" placeholder="请输入公司简介">
                                </div>
                                <div class="form-group">
                                    <label for="Modify-company-logo">公司图标</label>
                                    <input type="file" id="Modify-company-logo">
                                </div>
                                <button type="button" class="btn btn-default" id="js_ModifyCompany_btn">修改</button>
                            </form>
                        </div>
                    </div>
                </div>
`

Modify.prototype = {
    init:function(){
        this.createDom();
       
    },
    createDom(){
        this.el = $("<div></div>");
        this.el.append(Modify.Template);
        this.details.append(this.el)
    }
   
}