{
    var mySwiper = new Swiper('.swiper-container', {
        // initialSlide: 2,
        speed: 300,
        autoplay: {
            delay: 3000
        },
        pagination: {
            el: '.swiper-pagination',
        },
    })
}
{
    //滚动效果
    var myScroll = new IScroll('.content', {
        scrollbars: true,
        mouseWheel: true,
        shrinkScrollbars: "clip",
        click:true
    })
}
{
    var state = "project";
    //点击新增
    let add = $(".add");
    add.click(function () {
        $(".mask").show();
        $(".inputarea").transition({y: 0}, 600);
        $(".submit").show();
        $(".update").hide();

    });
    $(".cancel").click(function () {
        $(".inputarea").transition({y: "-62vh"}, 600, function () {
            $(".mask").hide();
        })
    })
    $(".submit").click(function () {
        var val = $("#text").val(); //
        if (val === "") {
            return;
        }
        $("#text").val("");
        var data = getData();
        var time = new Date().getTime();  //保存时间的方法，保存为字符串
        data.push({content: val, time: time, star: false, done: false});
        saveData(data);
        render();
        $(".inputarea").transition({y: "-62vh"}, 600, function () {
            $(".mask").hide();
        });
    });
    $(".update").click(function () {
        var val = $("#text").val();
        // if (val === "") {
        //     return;
        // }
        $("#text").val("");
        var data = getData();
        var index1 = $(this).data("index");
        console.log(index1);
        data[index1].content = val;
        saveData(data);
        $(".inputarea").transition({y: "-62vh"}, 600, function () {
            $(".mask").hide();
            render();
        })
    })

    function getData() {
        return localStorage.todo ? JSON.parse(localStorage.todo) : [];
    }

    function saveData(data) {
        localStorage.todo = JSON.stringify(data);
    }

    function render() {
        var data = getData();
        var str = "";
        data.forEach(function (val, index) {
            // str+="<li><p>"+val.content+"</p><time>"+parseTime(val.time)+"</time><span>※</span> <div class=\"changestate\">完成</div></li>"
            if (state === "project" && val.done === false) {
                str += "<li id=" + index + "><p>" + val.content + "</p><time>" + parseTime(val.time) + "</time><span class=" + (val.star ? "active" : "") + ">※</span><div class='changestate'>完成</div></li>"
            } else if (state === "done" && val.done === true) {
                str += "<li id=" + index + "><p>" + val.content + "</p><time>" + parseTime(val.time) + "</time><span class=" + (val.star ? "active" : "") + ">※</span><div class='del'>删除</div></li>"
            }
        });
        $(".itemlist").html(str);
        myScroll.refresh();
        addTouchEvent();
    }

    render();

    function parseTime(time) {
        var date = new Date();
        date.setTime(time);
        var year = date.getFullYear();
        var month = setZero(date.getMonth() + 1);
        var days = setZero(date.getDate());
        var hours = setZero(date.getHours());
        var min = setZero(date.getMinutes());
        var sec = setZero(date.getSeconds());
        // return `${year}/${month}/${days} ${hours}:${min}:${sec}`;
        return year + "/" + month + "/" + days + "<br>" + hours + ":" + min + ":" + sec;

    }

    function setZero(n) {
        return n < 10 ? "0" + n : n;
    }

    function addTouchEvent() {
        $(".itemlist>li").each(function (index, ele) {
            var hammerobj = new Hammer(ele);
            let sx, movex;
            let max = window.innerWidth / 5;
            let state = "start";
            let flag = true; //决定手指离开之后要不要有动画
            hammerobj.on("panstart", function (e) {
                // ele.style.transition = "";
                // sx = e.targetTouches[0].clientX;
                sx = e.center.x;
            })
            hammerobj.on("panmove", function (e) {
                let ox = e.center.x;
                movex = ox - sx;
                if (movex > 0 && state === "start") {
                    flag = false;
                    return;
                }
                if (movex < 0 && state === "end") {
                    flag = false;
                    return;
                }
                if (Math.abs(movex) > max) {
                    flag = false;
                    state = state === "start" ? "end" : "start";
                    if (state === "end") {
                        // ele.style.transform = `translateX(${-max}px)`;
                        $(ele).css("x", -max);
                    } else {
                        // ele.style.transform = "translateX(0)";
                        $(ele).css("x", 0);
                    }
                    return;
                }
                if (state === "end") {
                    movex = ox - sx - max;
                }
                flag = true;
                // this.style.transform = `translateX(${movex}px)`;
                $(ele).css("x", movex)
            })
            hammerobj.on("panend", function () {
                if (!flag) return;
                // ele.style.transition = "all .5s"
                if (Math.abs(movex) > max / 2) {
                    // ele.style.transform = `translateX(${-max}px)`;
                    $(ele).transition({x: -max});
                    state = "end";
                } else {
                    // ele.style.transform = "translateX(0)";
                    $(ele).transition({x: 0});
                    state = "start";
                }
            })
        })
    }

    $(".project").click(function () {
        $(this).addClass("active1").siblings().removeClass("active1");
        state = "project";
        render();
    })
    $(".done").click(function () {
        $(this).addClass("active1").siblings().removeClass("active1");
        state = "done";
        render();
    })
    $(".itemlist").on("click", ".changestate", function () {
        var index1 = $(this).parent().attr("id");
        console.log(index1);
        var data = getData();
        data[index1].done = true;
        saveData(data);
        render();
    })
        .on("click", ".del", function () {
            var index1 = $(this).parent().attr("id");
            var data = getData();
            data.splice(index1, 1);
            saveData(data);
            render();
        })
        .on("click", "span", function () {
            var index1 = $(this).parent().attr("id");
            var data = getData();
            data[index1].star = !data[index1].star;
            saveData(data);
            render();
        })
        .on("click", "p", function () {
            var index1 = $(this).parent().attr("id");
            var data = getData();
            $(".mask").show();
            $(".inputarea").transition({y: 0}, 600);
            $("#text").val(data[index1].content);
            $(".submit").hide();
            $(".update").show().data("index", index1);
            saveData(data);
            render();
        })


}


