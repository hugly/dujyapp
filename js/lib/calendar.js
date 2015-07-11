/**
 * Created by hulgy on 14/12/1.
 */
var calendar=function(data){
    this.body=data.body || $('body');
    this.type=data.type || 'get';
    this.url=data.url || "";
    this.disPre=data.disPre || true;
    this.disNext=data.disNext || true;
    this.ticketNum=data.ticketNum || 10;
    this.callback=data.clickFun;
    this.call=data.callback;

    this.init();
};

calendar.prototype={
    //父级
    oParent:$("<div class='calendar_plugin'></div>"),
    //日历计数器
    iNowTime:0,
    //初始化
    init:function(){
        var _this=this;

        this.createCalendarTitle(0,function(){
            _this.createCalendarTitle(1,function(){
                _this.createCalendarTitle(2);
            });
        });
    },
    //获取api数据
    getApiData:function(num,oPre,oTheday,oNext,oHead,callback){
        var _this=this,
            oDate=new Date(),
            nowYear= 0,
            nowMouth= 0;
        oDate.setMonth(oDate.getMonth()+parseInt(num));

        nowYear=oDate.getFullYear();
        nowMouth=oDate.getMonth()+1;

        this.zoomFun("block");
        if(this.url){
            $.ajax({
                type:_this.type,
                url: _this.getUrlData(_this.url,{
                    "year":nowYear,
                    "month":nowMouth
                }),
                contentType:"application/json",
                dataType:"json",
                success:function(rs){
                    _this.zoomFun("none");
                    var data=rs.Data;
                    data.sort(_this.compareArrObject("StartTime"));

                    _this.createCalendar(num,data,oPre,oTheday,oNext,oHead,callback);
                },
                error:function(e){
                    _this.zoomFun("none");
                    var state= e.status,
                        msg="";
                    if(state == "404" || state == "500"){
                        msg="服务器繁忙，请稍后再试!";
                    }else{
                        msg="无法连接服务器，请检查网络设置!";
                    }
                    //alert(msg);
                    _this.createCalendar(num,null,oPre,oTheday,oNext,oHead,callback);
                }
            });
        }else{
            _this.zoomFun("none");
            alert("请输入合法的url!");
        }

    },
    //事件绑定
    bindEvent:function(oPre,oNext,cells){
        var _this=this;
        //日历每天的点击事件
        cells.find(".hasEvent").on('click',function(){
            cells.find(".hasEvent").removeClass("icon");
            $(this).addClass("icon");

            var data={};
            data.StartTime=$(this).attr("data");
            data.LeftAmount=$(this).attr("ticket");
            data.Price=$(this).attr("price");
            _this.callback($(this),data);
        });

    },
    //创建日历头部以及选择月份部分
    createCalendarTitle:function(num,callback){
        var oDate=new Date(),
            oHead=$('<div class="operations"></div>'),
            oTitle=$('<div class="title"></div>'),
            oRemote=$('<div class="remotes fullword"></div>'),
            oWeeks=$('<div class="weeks fullword"></div>'),
            oPre=$('<div class="preMouth"></div>'),
            oTheday=$('<span class="theday"></span>'),
            oNext=$('<div class="nextMouth"></div>');

        //this.oParent.html("");

        if(this.iNowTime==0){
            oPre.removeClass('hasPre');
        }else{
            oPre.addClass('hasPre');
        }

        for(var i= 0;i<7;i++){
            if(i==6){
                oWeeks.append($('<div class="weekDays sunday">'+week[i]+'</div>'));
            }else if(i==5){
                oWeeks.append($('<div class="weekDays saturday">'+week[i]+'</div>'));
            }else{
                oWeeks.append($('<div class="weekDays">'+week[i]+'</div>'));
            }
        }

        oTheday.html(oDate.getFullYear()+'年'+(oDate.getMonth()+num+1)+'月');

        oTitle.append(oPre);
        oRemote.append(oTheday);

        oTitle.append(oRemote);
        oRemote.append(oWeeks);
        oTitle.append(oNext);

        this.oParent.append(oTitle);
        this.body.append(this.oParent);

        this.getApiData(num,oPre,oTheday,oNext,oHead,callback);
    },
    //创建日历
    createCalendar:function(digit,data,oPre,oTheday,oNext,oHead,callback){
        var m=this.getFirstDay(digit),
            d=this.getMonthDay(digit),
            nowDay=this.getNowDay(digit),
            lastDays=this.getPreDays(digit),
            cells=$('<div class="cells"></div>'),
            oCalendar=$('<div class="calendar_con"></div>'),
            hasPriceArr=[],
            num= 0,
            height=this.body.height()-oHead.height()-1,
            width=this.body.width()-2;

        this.iNowTime=digit;
        if(data){
            for(var i= 0,j=data.length;i<j;i++){
                var day=data[i].StartTime;
                day = day.replace(new RegExp("-", "g"), "/");
                oDate = new Date(day);

                hasPriceArr.push(oDate.getDate());
            }
        }

        if(m==0) m=7;
        //m--;
        //插入上个月的天数
        if(m==6 && d>29 || m==5 && d==31){
            for(var i= 0;i<m;i++){
                if(this.disPre) {
                    oCalendar.prepend($('<div class="pastDay"><span class="past">' + (lastDays - i) + '</span></div>'));
                }else{
                    oCalendar.prepend($('<div class="pastDay"><span class="past"></span></div>'));
                }
            }
        }else{
            for(var i= 0;i<m+7;i++){
                if(this.disPre){
                    oCalendar.prepend($('<div class="pastDay"><span class="past">'+(lastDays-i)+'</span></div>'));
                }else{
                    oCalendar.prepend($('<div class="pastDay"><span class="past"></span></div>'));
                }
            }
        }

        //插入本月的天数
        for(var i= 1;i<d+1;i++){
            var str="";
            if(this.iNowTime==0 && i<nowDay){
                oCalendar.append($('<div class="nowDay"><span class="asap">'+i+'</span></div>'));
            }else{
                if(data && hasPriceArr.indexOf(i)!=-1){
                    if(i==nowDay && this.iNowTime==0){
                        if(data[num].LeftAmount>this.ticketNum){
                            oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="today">今天</span><span class="price">￥'+data[num].Price+'</span></div>'));
                        }else{
                            oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="today">今天</span><span class="price">￥'+data[num].Price+'</span></div>'));
                        }
                    }else{
                        oCalendar.append($('<div class="nowDay hasEvent" data="'+data[num].StartTime+'" ticket="'+data[num].LeftAmount+'" price="'+data[num].Price+'"><span class="asap">'+i+'</span><span class="price">￥'+data[num].Price+'起</span></div>'));
                    }
                    num++;
                }else{
                    if(i==nowDay && this.iNowTime==0) {
                        oCalendar.append($('<div class="nowDay"><span class="asap">今天</span></div>'));
                    }else{
                        oCalendar.append($('<div class="nowDay"><span class="asap">'+i+'</span></div>'));
                    }
                }
            }
        }
        oCalendar.find(".hasEvent").first().addClass('icon');
        this.dateInit(oCalendar);

        var oDate=new Date(),
            len=oCalendar.children().length;

        //插入下个月的天数
        if(len<42){
            for(var i=1;i<=42-len;i++){
                if(this.disNext) {
                    oCalendar.append($('<div class="futureDay"><span class="past">' + i + '</span></div>'));
                }else{
                    oCalendar.append($('<div class="futureDay"><span class="past"></span></div>'));
                }
            }
        }

        oDate.setMonth(oDate.getMonth()+this.iNowTime);
        oTheday.html(oDate.getFullYear()+'年'+(oDate.getMonth()+1)+'月');

        cells.append(oCalendar);
        this.oParent.append(cells);
        this.body.append(this.oParent);
        this.bindEvent(oPre,oNext,cells);
        callback && callback();
    },
    //寻找最近有价格的日期
    searchData:function(oParent,arr,now){
        var aDays=oParent.find(".nowDay");
        if(arr.indexOf(now)!=-1){
            $(aDays[now-1]).addClass("icon");
        }else{

        }
    },
    //获取上个月有多少天
    getPreDays:function(num){
        var oDate=new Date();

        oDate.setMonth(oDate.getMonth()+parseInt(num));
        oDate.setDate(0);

        return oDate.getDate();
    },
    //获取每个月的第一天是星期几
    getFirstDay:function(num){
        var oData=new Date();

        oData.setMonth(oData.getMonth()+parseInt(num));
        oData.setDate(1);
        return oData.getDay();
    },
    //获取本月的天数
    getMonthDay:function(num){
        var oDate=new Date();

        oDate.setMonth(oDate.getMonth()+parseInt(num));
        oDate.setMonth(oDate.getMonth()+1);
        oDate.setDate(0);

        return oDate.getDate();
    },
    //获取今天的号数
    getNowDay:function(num){
        var oDate=new Date();
        oDate.setMonth(oDate.getMonth()+parseInt(num));

        return oDate.getDate();
    },
    //日历日期价格初始化
    dateInit:function(oParent){
        var data={},
            oIcon=oParent.find(".icon");
        data.StartTime=oIcon.attr("data");
        data.LeftAmount=oIcon.attr("ticket");
        data.Price=oIcon.attr("price");
        this.call(data);
    },
    //遮罩层
    zoomFun:function(val){
        var oZoom=$("#zoom"),
            oLoad=$("#load");

        oZoom.css({
            display:val
        });
        oLoad.css({
            display:val
        });
    },
    //设置URL中的参数并返回URL
    getUrlData:function(url,json){
    var urlString=url.split("?")[0]+"?",
        search = url.split("?")[1],
        searchs=[],
        dataName=[],
        dataValue=[],
        dataString=[],
        afterUrl="";

    searchs = search.split("&");

    for(var i= 0,j=searchs.length;i<j;i++){
        var data=searchs[i].split("=");
        dataName.push(data[0]);
        dataValue.push(data[1]);
    }

    for(var i= 0,j=dataName.length;i<j;i++){
        for(var name in json){
            if(name==dataName[i]){
                dataValue[i]=json[name];
            }
        }
    }
    for(var i= 0,j=dataName.length;i<j;i++){
        var str=dataName[i]+"="+dataValue[i];
        dataString.push(str);
    }
    afterUrl=urlString+dataString.join("&");
    return afterUrl;
},
    //数组比较器
    compareArrObject:function(propertyName){
        return function(object1,object2){
            var value1=object1[propertyName],
                value2=object2[propertyName];
            if(value2<value1){
                return 1;
            }else if(value2>value1){
                return -1;
            }else{
                return 0;
            }
        }
    }
};

week={
    0:"日",
    1:"一",
    2:"二",
    3:"三",
    4:"四",
    5:"五",
    6:"六"
};