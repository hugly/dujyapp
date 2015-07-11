/**
 * Created by hulgy on 7/9/15.
 */
(function(){
    $.fn.numCalute=function(setting){

        return this.each(function(){
            var oParent=$(this);

            var numCalute={
                index: parseInt(oParent.find("input").val()) || 0,
                init:function(){
                    this.bindEvent();
                },
                bindEvent:function(){
                    var _this=this,
                        num= 0,
                        body=oParent;


                    if(num==0){
                        body.find(".sub").addClass("dissub");
                    }

                    body.find(".sub").on("tap",function(){
                        num=$(this).next().val();
                        num--;
                        if(num<1){
                            num=0;
                            $(this).addClass("dissub");
                        }
                        $(this).next().val(num);
                    });

                    body.find(".add").on("tap",function(){
                        num=$(this).prev().val();
                        num++;
                        $(this).prev().prev().removeClass("dissub");
                        $(this).prev().val(num);
                    });
                }
            };
            numCalute.init();
        })
    };
})(Zepto);