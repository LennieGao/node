function Page(){
    this.container = $("#header");
    // this.details = $("#details");
    this.init();
}

Page.prototype = {
    init:function(){
        this.create()
    },
    create(){
        this.header = new Header(this.container);
        this.login = new Login(this.container);
        this.register = new Register(this.container);
        // this.details = new Modify(this.details);
        this.TabBar = new TabBar().init();
        this.render = new TabBar().handleCompanyClick(new TabBar().handleGetCompanySucc)
    }
}


new Page();9                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            