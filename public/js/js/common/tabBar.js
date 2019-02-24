function TabBar() {
    this.container = $("#tabBar");
    this.detailsContent = $(".detailsContent");
    this.page = 1;

}

TabBar.Template = `
    <ul class="tabNav">
        <li>
            <a href="##">系统首页</a>
        </li>
        <li>
            <a href="##">公司管理</a>
            <ul>
                <li><a href="##" id="js_company_list">公司列表</a></li>
                <li><a href="##" id="js_add_company">新增公司</a></li>
            </ul>
        </li>
        <li>
            <a href="##" id="scharts">条形图</a>
        </li>
        <li>
            <a href="##" id="drag">矩形图</a>
        </li>
        <li>
            <a href="##" id="box">雷达图</a>
        </li>
    </ul>
`;
TabBar.prototype = {
    init: function () {
        this.createDom();
        this.tabToggle();
        this.addCompany();
        this.companyList();
        this.schart();
    },
    createDom: function () {
        this.el = $("<div></div>");
        this.el.append(TabBar.Template);
        this.container.append(this.el);
    },
    tabToggle: function () {
        this.el.find(".tabNav>li").children(0).on("click", $.proxy(this.handleTabClick))
    },
    handleTabClick: function () {
        $(this).next().slideToggle();
    },
    addCompany: function () {
        this.el.find("#js_add_company").on("click", $.proxy(this.handleAdd, this))
    },
    handleAdd: function () {
        this.detailsContent.load("../../../html/addCompany.html", $.proxy(this.handleSucc, this));
    },
    handleSucc: function () {

        $("#js_addCompany_btn").on("click", $.proxy(this.handleAddCompany, this))
    },
    //添加公司
    handleAddCompany: function () {

        this.companyName = $("#company-name");
        this.companyScale = $("#company-scale");
        this.companySynopsis = $("#company-synopsis");
        this.companyLogo = $("#company-logo");

        //模拟form表单提交
        var formData = new FormData();

        formData.append("companyName", this.companyName.val());
        formData.append("companyScale", this.companyScale.val());
        formData.append("companySynopsis", this.companySynopsis.val());
        formData.append("companyLogo", this.companyLogo[0].files[0]);

        $.ajax({
            type: "post",
            url: "/company/addCompany",
            data: formData,
            contentType: false,
            processData: false,
            success: $.proxy(this.handleAddSucc, this)
        })
    },
    handleAddSucc: function (data) {
        if (data.status) {
            alert("添加成功");
            this.companyName.val("")
            this.companyScale.val("")
            this.companySynopsis.val("")
            this.companyLogo.val("")
        }
    },
    //分页开始
    companyList: function () {
        //当点击公司列表的时候 触发了一个函数 handleCompanyClick
        $("#js_company_list").on("click", this.handleGetCompanySucc, $.proxy(this.handleCompanyClick, this))
    },
    handleCompanyClick(params) {

        //清空 detailsContent
        this.detailsContent.text("");

        //获取数据 第一次获取数据5条数据 需要将这个5条数据渲染到页面上handleGetCompanySucc
        $.ajax({
            type: "get",
            url: "/company/companyList",
            headers: {
                "X-Token": Cookies.get("token")
            },
            data: {
                page: this.page,
                limit: 5
            },
            success: $.proxy(Object.prototype.toString.call(params) == "[object Function]" ? params : params.data, this)
        })
    },
    handleGetCompanySucc(data) {
        if (data.status) {
            //渲染到页面上
            this.render(data);

            //分页页码
            //new LayPage().init(this,data);
        } else {
            alert(data.info);
        }
    },
    
    handleGetCompanyPageSucc(data) {
        if (data.status) {
            this.render(data);
        } else {
            alert(data.info);
        }

    },
    render(data) {
        var str = "";
        for (var i = 0; i < data.data.length; i++) {
            str += `
            <div class="company-item" data-id=${data.data[i]._id}>
                <div class="company_t" data-toggle="modal" data-target="#modify_model">
                    <div class="company-logo">
                        <img src="http://localhost:3000${data.data[i].companyLogo}" />
                    </div>
                    <p class="company-name">${data.data[i].companyName}</p>
                    <p class="company-scale">${data.data[i].companyScale}</p>
                    <p class="company-des">${data.data[i].companySynopsis}</p>
                </div>
                <div class="company-b">
                        <span>27</span>
                        <p>在招职位</p>
                </div>
            </div>
            `
        }
        this.detailsContent.html(str);
        var companyList = $(".company-item");
        new ModifyCompany(companyList);


    },
    //分页结束
    //统计图开始
    schart: function () {
        this.el.find("#scharts").on("click", $.proxy(this.handleSchartClick, this))
        this.el.find("#drag").on("click", $.proxy(this.handleDragClick, this))
        this.el.find("#box").on("click", $.proxy(this.handleBoxClick, this))

    },

    handleSchartClick: function () {
        this.detailsContent.text("");
        this.detailsContent.append($("<div id='main'></div>"));


        var option = {
            title: {
                text: 'BK1821数据统计'
            },
            tooltip: {},
            legend: {
                data: ['身高', "体重", "长度"]
            },
            xAxis: {
                data: ["郗新华", "马良博	", "张宇", "赵亚华"]
            },
            yAxis: {
                min: 5,
                max: 200
            },
            series: [{
                    name: '身高',
                    type: 'pie',
                    data: [175, 170, 180, 185]
                },
                {
                    name: '体重',
                    type: 'pie',
                    data: [180, 200, 150, 155]
                },
                {
                    name: '长度',
                    type: 'pie',
                    data: [5, 11, 12, 20]
                }
            ]
        };




        new Charts(this.detailsContent.find("#main"), option);
    },
    handleDragClick: function () {
        this.detailsContent.text("");
        this.detailsContent.append($("<div id='main'></div>"));
        var option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        new Charts(this.detailsContent.find("#main"), option);
    },
    handleBoxClick: function () {
        this.detailsContent.text("");
        this.detailsContent.append($("<div id='main'></div>"));
        var dataBJ = [
            [55,9,56,0.46,18,6,1],
            [25,11,21,0.65,34,9,2],
            [56,7,63,0.3,14,5,3],
            [33,7,29,0.33,16,6,4],
            [42,24,44,0.76,40,16,5],
            [82,58,90,1.77,68,33,6],
            [74,49,77,1.46,48,27,7],
            [78,55,80,1.29,59,29,8],
            [267,216,280,4.8,108,64,9],
            [185,127,216,2.52,61,27,10],
            [39,19,38,0.57,31,15,11],
            [41,11,40,0.43,21,7,12],
            [64,38,74,1.04,46,22,13],
            [108,79,120,1.7,75,41,14],
            [108,63,116,1.48,44,26,15],
            [33,6,29,0.34,13,5,16],
            [94,66,110,1.54,62,31,17],
            [186,142,192,3.88,93,79,18],
            [57,31,54,0.96,32,14,19],
            [22,8,17,0.48,23,10,20],
            [39,15,36,0.61,29,13,21],
            [94,69,114,2.08,73,39,22],
            [99,73,110,2.43,76,48,23],
            [31,12,30,0.5,32,16,24],
            [42,27,43,1,53,22,25],
            [154,117,157,3.05,92,58,26],
            [234,185,230,4.09,123,69,27],
            [160,120,186,2.77,91,50,28],
            [134,96,165,2.76,83,41,29],
            [52,24,60,1.03,50,21,30],
            [46,5,49,0.28,10,6,31]
        ];
        
        var dataGZ = [
            [26,37,27,1.163,27,13,1],
            [85,62,71,1.195,60,8,2],
            [78,38,74,1.363,37,7,3],
            [21,21,36,0.634,40,9,4],
            [41,42,46,0.915,81,13,5],
            [56,52,69,1.067,92,16,6],
            [64,30,28,0.924,51,2,7],
            [55,48,74,1.236,75,26,8],
            [76,85,113,1.237,114,27,9],
            [91,81,104,1.041,56,40,10],
            [84,39,60,0.964,25,11,11],
            [64,51,101,0.862,58,23,12],
            [70,69,120,1.198,65,36,13],
            [77,105,178,2.549,64,16,14],
            [109,68,87,0.996,74,29,15],
            [73,68,97,0.905,51,34,16],
            [54,27,47,0.592,53,12,17],
            [51,61,97,0.811,65,19,18],
            [91,71,121,1.374,43,18,19],
            [73,102,182,2.787,44,19,20],
            [73,50,76,0.717,31,20,21],
            [84,94,140,2.238,68,18,22],
            [93,77,104,1.165,53,7,23],
            [99,130,227,3.97,55,15,24],
            [146,84,139,1.094,40,17,25],
            [113,108,137,1.481,48,15,26],
            [81,48,62,1.619,26,3,27],
            [56,48,68,1.336,37,9,28],
            [82,92,174,3.29,0,13,29],
            [106,116,188,3.628,101,16,30],
            [118,50,0,1.383,76,11,31]
        ];
        
        var dataSH = [
            [91,45,125,0.82,34,23,1],
            [65,27,78,0.86,45,29,2],
            [83,60,84,1.09,73,27,3],
            [109,81,121,1.28,68,51,4],
            [106,77,114,1.07,55,51,5],
            [109,81,121,1.28,68,51,6],
            [106,77,114,1.07,55,51,7],
            [89,65,78,0.86,51,26,8],
            [53,33,47,0.64,50,17,9],
            [80,55,80,1.01,75,24,10],
            [117,81,124,1.03,45,24,11],
            [99,71,142,1.1,62,42,12],
            [95,69,130,1.28,74,50,13],
            [116,87,131,1.47,84,40,14],
            [108,80,121,1.3,85,37,15],
            [134,83,167,1.16,57,43,16],
            [79,43,107,1.05,59,37,17],
            [71,46,89,0.86,64,25,18],
            [97,71,113,1.17,88,31,19],
            [84,57,91,0.85,55,31,20],
            [87,63,101,0.9,56,41,21],
            [104,77,119,1.09,73,48,22],
            [87,62,100,1,72,28,23],
            [168,128,172,1.49,97,56,24],
            [65,45,51,0.74,39,17,25],
            [39,24,38,0.61,47,17,26],
            [39,24,39,0.59,50,19,27],
            [93,68,96,1.05,79,29,28],
            [188,143,197,1.66,99,51,29],
            [174,131,174,1.55,108,50,30],
            [187,143,201,1.39,89,53,31]
        ];
        
        var lineStyle = {
            normal: {
                width: 1,
                opacity: 0.5
            }
        };
        
        option = {
            backgroundColor: '#161627',
            title: {
                text: 'AQI - 雷达图',
                left: 'center',
                textStyle: {
                    color: '#eee'
                }
            },
            legend: {
                bottom: 5,
                data: ['北京', '上海', '广州'],
                itemGap: 20,
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                },
                selectedMode: 'single'
            },
            // visualMap: {
            //     show: true,
            //     min: 0,
            //     max: 20,
            //     dimension: 6,
            //     inRange: {
            //         colorLightness: [0.5, 0.8]
            //     }
            // },
            radar: {
                indicator: [
                    {name: 'AQI', max: 300},
                    {name: 'PM2.5', max: 250},
                    {name: 'PM10', max: 300},
                    {name: 'CO', max: 5},
                    {name: 'NO2', max: 200},
                    {name: 'SO2', max: 100}
                ],
                shape: 'circle',
                splitNumber: 5,
                name: {
                    textStyle: {
                        color: 'rgb(238, 197, 102)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                            'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                            'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(238, 197, 102, 0.5)'
                    }
                }
            },
            series: [
                {
                    name: '北京',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataBJ,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#F9713C'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '上海',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataSH,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#B3E4A1'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.05
                        }
                    }
                },
                {
                    name: '广州',
                    type: 'radar',
                    lineStyle: lineStyle,
                    data: dataGZ,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: 'rgb(238, 197, 102)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            opacity: 0.05
                        }
                    }
                }
            ]
        };
        new Charts(this.detailsContent.find("#main"), option);
    }

}

new TabBar()


/*
    
    page  limit   跳过
    1      5       0
    2      5       5
    3      5       10


    跳过多少条:(page-1)*limit




    后端分页逻辑

    mongodb 语法

    db.表名.find().skip(跳过多少条).limit(显示多少条).then((result)=>{
        result//显示哪些数据
    })

    //做分页
    db.表名.find().skip((page-1)*limit).limit(5).then((result)=>{
        result//显示哪些数据
         cb(result)
    })

    db.表名.find().then((result)=>{
        cb(result)
    })


    controller
        接受用户传递过来的参数
       let {page,limit} = req.query

        findCompany({page,limit},(data)=>{
            if(data.lenth>0){
                findCompanyCount((result)=>{
                    res.json({
                        status:true,
                        data:data,
                        count:result.length
                    })
                })
            }
        })


    返回数据的类型
        {
            status:true,
            data:result,
            count:数据的总条数
        }





    前端：
        点击公司列表
            $.ajax({
                url:"",
                data:{
                    page:1,
                    limit:5
                },
                success:function(data){
                    console.log(data);//这里面有5条数据
                }
            })
            显示 1-5条数据


        点击第二页的时候

            主要变的是page
            (
                但是：
                    问题：
                       1、 jq里面没有办法给函数设定初始值
                       2、死循环
                    

                

            )

            $.ajax({
                url:"",
                data:{
                    page:2,
                    limit:5
                },
                success:function(data){
                    console.log(data);//这里面有5条数据
                }
            })


*/