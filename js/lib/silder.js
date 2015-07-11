/**
 * Created by hulgy on 15/4/2.
 */
$(document).ready(function(){
    var oInit=new Init();
});
//所有js初始化以及一些小动作比如input框的默认值
var Init=function(){
    this.init();
}
Init.prototype={
    //入口函数
    init:function(){
        if($("#banner").length>=1){
            this.silderInit();
        }
        if($("#search-box").length>0){
            this.screenInit();
        }
        this.inputInit();
        if($(".choose-num").length>0){
            this.subAndAdd();
        }
        if($("#safeChoose").length>0){
            this.chooseSafe();
        }
    },
    //silder初始化
    silderInit:function(){
        var list = [
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'},
            //{content: '<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>'}
        ];
        $("#temp-data").find("li").each(function(){
            var json={};
            json.content=$(this).html();
            list.push(json);
        });
        //<a href="javascript:;"><img src="../../data-images/b1.jpg"></a>
        var opts = {
            type: 'dom',
            data: list,
            dom: document.getElementById("banner"),
            isLooping: true
        };
        var	islider = new iSlider(opts);
        islider.addDot();
        $("#banner").append($(".islider-dot-wrap"));
    },
    //初始化input框
    inputInit:function(){
        var value;
        $('input').on('focus',function(){
            $(this).css({
                color:"#303030"
            });
            value=$(this).attr("text");
            if($(this).val()==value){
                $(this).val("");
            }
        });

        $('input').on('blur',function(){
            if($(this).val()==""){
                $(this).css({
                    color:"#969696"
                });
                $(this).val(value);
            }
        });
    },
    //筛选排序动作
    screenInit:function(){
        var oSearch=$("#search-box"),
            isShow=true;
        oSearch.find(".sort").on("click",function(){
            if(isShow){
                $(this).addClass('active');
                $("#sort-box").css({
                    display:"block"
                });
            }else{
                $(this).removeClass('active');
                $("#sort-box").css({
                    display:"none"
                });
            }
            isShow=!isShow;
        });

        $("#sort-box").find("li").on("click",function(){
            $("#sort-box").find("li").removeClass('active');
            $(this).addClass("active");
            $("#sort-box").css({
                display:"none"
            });
            oSearch.find(".sort b").html($(this).find("a").html());
            oSearch.find(".sort").removeClass('active');
            isShow=true;
        });
    },
    //加减框
    subAndAdd:function(){
        var oChoose=$(".choose-num"),
            oSubBtn=oChoose.find(".sub"),
            oAddBtn=oChoose.find(".add"),
            oSpan=oChoose.find(".num"),
            i=0;

        if(i==0){
            oSubBtn.addClass("dissub");
        }

        oSubBtn.on("touchstart",function(){
            i=$(this).next().val();
            i--;
            if(i<1){
                i=0;
                $(this).addClass("dissub");
            }
            $(this).next().val(i);
        });

        oAddBtn.on("touchstart",function(){
            i=$(this).prev().val();
            i++;
            $(this).prevAll(".sub").removeClass("dissub");
            $(this).prev().val(i);
        });
    },
    //选择保险
    chooseSafe:function(){
        var oSafe=$("#safeChoose"),
            oB=$("<b></b>");

        oSafe.find("li").on("touchstart",function(){
            $(this).find("i").append(oB);
        });
    }
};























