/**
 * Created by hulgy on 15/1/21.
 */
$(document).ready(function(){
    //var scroll=new SCROLL($("#banner"));
    //$(window).resize(function(){
    //    scroll.init();
    //    $("#banner ul").removeAttr("style");
    //    scroll.iNow=0;
    //});
});
var SCROLL=function(obj){
    this.parent=obj;
    this.init();
}
SCROLL.prototype={
    timer:null,
    //当前索引
    iNow:0,
    //外层宽度
    //初始化
    init:function(){
        this.initBanner();
        this.autoScroll();
    },
    //初始化banner列表
    initBanner:function(){
        var _this=this,
            width=this.parent.width();

        this.parent.find("p").html("");
        this.parent.find("ul li").each(function(index){
            $(this).css({
                left:index*width
            });
            _this.parent.find("p").append($('<span class="ball"></span>'));
            _this.parent.find(".ball").eq(0).addClass('active');
        });
        this.bindEvent();
    },
    //绑定事件
    bindEvent:function(){
        var _this=this;
        touch.on(_this.parent,'swiperight',function(ev){
            clearInterval(_this.timer);
            _this.iNow--;
            _this.outAn(_this.iNow);
            _this.autoScroll();
        });
        touch.on(_this.parent,'swipeleft',function(ev){
            clearInterval(_this.timer);
            _this.iNow++;
            _this.outAn(_this.iNow);
            _this.autoScroll();
        });
    },
    //自动滚动事件
    autoScroll:function(){
        var _this=this;
        clearInterval(this.timer);
        this.timer=setInterval(function(){
            _this.iNow++;
            _this.outAn(_this.iNow);
        },5000);
    },
    //外层动画
    outAn:function(n){
        var width=this.parent.width(),
            len=this.parent.find("ul li").length,
            times=parseInt(n/len),
            index=Math.abs(n%len);

        this.parent.find("ul li").eq(n%len).css({
            left:(n%len)*width+times*len*width
        });

        this.parent.find("ul").css({
            '-webkit-transform': 'translate3d('+(-width*n)+'px, 0px, 0px)',
            "-webkit-transition": "all 1s"
        });
        if(n>0){
            this.parent.find('span').removeClass('active');
            this.parent.find('span').eq(index).addClass('active');
        }else if(n==0 || index==0){
            this.parent.find('span').removeClass('active');
            this.parent.find('span').eq(0).addClass('active');
        }else{
            this.parent.find('span').removeClass('active');
            this.parent.find('span').eq(len-index).addClass('active');
        }
    }
};