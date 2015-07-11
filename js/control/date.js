/**
 * Created by hulgy on 15/4/7.
 */
$(document).ready(function(){
    var oCalendar=new calendar({
        body:$("#calendar"),         //@param:jqobj      父级
        url:"http://b2c.isonfor.com/Product/GetPackageStockPrice?packageId=100003362&year=2015&month=3",
        //@param:string     api地址
        type:"get",                     //@param:string     get/post  请求方式
        disPre:true,                    //@param:boolean    是否显示上个月
        disNext:true,                   //@param:boolean    是否显示下个月
        ticketNum:100,                  //@param:num/int    根据余票数量判断是否显示余票
        clickFun:function(obj,data){        //@param:function   点击事件的回调函数 *必填项
            //if (data) {
            //    $(".details-depart").find("input[name=cost]").val(data.StartTime.split(" ")[0] + "    价格 ￥" + data.Price + " (成人）");
            //    $(".details-depart").find("input[name=cost]").attr({ 'data-time': data.StartTime.split(" ")[0] });
            //    $(".details-depart").find("input[name=costTime]").val(data.StartTime.split(" ")[0]);
            //} else {
            //    $(".details-depart").find("input[name=cost]").val("暂无相关信息");
            //}
        },
        callback:function(data){
            //$(".details-depart").find("input[name=cost]").val(data.StartTime.split(" ")[0] + "    价格 ￥" + data.Price + " (成人）");
            //$(".details-depart").find("input[name=cost]").attr({ 'data-time': data.StartTime.split(" ")[0] });
            //$(".details-depart").find("input[name=costTime]").val(data.StartTime.split(" ")[0]);
        }
    });
});