//1.前面补0
function p(n){
    return n<10?'0'+n:n;
}

//定时器白
var whiteOne=1;
//定时器黑
var blackOne=1;
//2.倒计时
function getMyTime1(){
    var m=parseInt(whiteOne/60%60);
    var s=parseInt(whiteOne%60);
    document.getElementById('whiteTime').innerHTML=p(m)+':'+p(s);
    whiteOne=whiteOne+1;
    if(whiteOne>=600){
        document.getElementById('time').innerHTML='游戏结束';
    }
}
//t1=setInterval('getMyTime1()',1000);


//2.倒计时
function getMyTime2(){
    var m=parseInt(blackOne/60%60);
    var s=parseInt(blackOne%60);
    document.getElementById('blackTime').innerHTML=p(m)+':'+p(s);
    blackOne=blackOne+1;
    if(blackOne>=600){
        document.getElementById('blackTime').innerHTML='游戏结束';
    }
}



$(function(){
    // var canvas=document.getElementById('canvas');
    var canvas=$('#canvas').get(0);
    var ctx=canvas.getContext('2d');
    var width=$("#canvas").width();
    var audio=$('.audio').get(0);
    var audioc=$('.cmusic').get(0);
    var ROW=15;
    var off=width/ROW;
    var flag=true;
    var block={};
    var ai=false;
    var blank={};
    var biao=$('#biao').get(0);
    // var biao=biao.getContext('2d');
    var biao2=$('#biao2').get(0);
    // var biao2=biao2.getContext('2d');
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }
    var t1=1;
    var t2=1;
    // $('.canvas').fadeIn();
    console.log(blank);
    //画小圆
    function drawCircle(x,y){
        ctx.beginPath();
        ctx.arc(x,y,2,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    //画横线
    function makeLine(){
        ctx.beginPath();
        for(var i=0;i<ROW;i++){
            ctx.moveTo(off/2 + 0.5,off/2 + 0.5+i*off);
            ctx.lineTo((ROW-0.5)*off+0.5,off/2 + 0.5+i*off);
        }
        ctx.stroke();

        ctx.closePath();
    }
    //画竖线
    function makeShu(){
        ctx.beginPath();
        for(var i=0;i<ROW;i++){
            ctx.moveTo(off/2+0.5+i*off,off/2+0.5);
            ctx.lineTo(off/2+0.5+i*off,(ROW-0.5)*off+0.5);
        }
        ctx.stroke();

        ctx.closePath();
    }

    //绘制棋盘页面
    function draw(){
        makeLine();
        drawCircle(3.5*off,3.5*off);
        drawCircle(11.5*off,3.5*off);
        drawCircle(7.5*off,7.5*off);
        drawCircle(3.5*off,11.5*off);
        drawCircle(11.5*off,11.5*off);
        makeShu();

    }
//    画棋子
    function drawChess(position,color){
        ctx.beginPath();
        if(color=="black"){
            var radgrad = ctx.createRadialGradient(-3,-3,2,0,0,15);
            radgrad.addColorStop(0, 'white');
            radgrad.addColorStop(0.5, 'black');
            ctx.fillStyle=radgrad;
            t1=setInterval('getMyTime1()',1000);
            clearInterval(t2);
            blackOne=1;
            document.getElementById('blackTime').innerHTML="00:00";
        }else if(color=='white'){
            // ctx.fillStyle="gray";
            ctx.shadowColor="black";
            ctx.shadowBlur=5;
            ctx.offsetX=1;
            ctx.offsetY=1;
            ctx.fillStyle='white';
            t2=setInterval('getMyTime2()',1000);
            clearInterval(t1);
            whiteOne=1;
            document.getElementById('whiteTime').innerHTML="00:00";
        }
        ctx.save();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5);
        ctx.arc(0,0,15,0,2*Math.PI);
        ctx.fill();
        ctx.restore();
        ctx.closePath();
        // clearInterval(t);
        audio.play();
        block[o2k(position)]=color;
        // console.log(block);
        delete blank[o2k(position)];
    }
    //检查棋子的摆放位置
    function check(pos,color){
        var num=1;
        var cos=1;
        var xie=1;
        var n=1;
        var table={};
        for(var i in block){
            if(block[i]==color){
                table[i]=true;
            }
        }
        // console.log(table);
        var tx=pos.x;
        var ty=pos.y;
        while(table[p2k(tx+1,ty)]){
            num++;
            // console.log(num)

            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[p2k(tx-1,ty)]){
            num++;
            tx--;

        }
        // console.log(num)

         var tx=pos.x;
         var ty=pos.y;

          while(table[p2k(tx,ty+1)]){
              cos+=1;
              ty++;
          }
          var tx=pos.x;
          var ty=pos.y;
          while(table[p2k(tx,ty-1)]){
              cos++;
              ty--;
          }
        // console.log(cos);
         //左斜
         tx=pos.x;
         ty=pos.y;
         while(table[p2k(tx+1,ty+1)]){
             xie++;
             ty++;
             tx++;
         }
         tx=pos.x;
         ty=pos.y;
         while(table[p2k(tx-1,ty-1)]){
             xie++;
             ty--;
             tx--;
         }

        //右
        tx=pos.x;
        ty=pos.y;
        while(table[p2k(tx+1,ty-1)]){
            n++;
            ty--;
            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[p2k(tx-1,ty+1)]){
            n++;
            ty++;
            tx--;
        }

        // return num>=5||cos>=5 || xie>=5 ||n>=5;
        return Math.max(num,cos,xie,n);

    }
    function p2k(x,y){
            return x+'_'+y
    }
    function o2k(position){
        return position.x+'_'+position.y;
    }
    function review(){
        var i=1;
        for(var pos in block){
            // k2o(pos)
            drawText(k2o(pos),i,block[pos]);
            i++;

        }
    }
    function k2o(pos){
        var arr=pos.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])};
    }
    function drawText(pos,text,color){
        ctx.save();
        if(color=="black"){
            ctx.fillStyle="white";
        }else if(color=="white"){
            ctx.fillStyle="black";
        }
        ctx.font="16px 微软雅黑";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.fillText(text,(pos.x+0.5)*off,(pos.y+0.5)*off);
        ctx.restore();
    }
    function startClick(){
        $('canvas').on('click',handleClick);

    }
    draw();
    var shu=0;
  function handleClick(e){
      var position={x:Math.round((e.offsetX-off/2)/off),y:Math.round((e.offsetY-off/2)/off)};
      // console.log(position.x*off);
      if(block[o2k(position)]){
          return;
      }
      //判断黑棋
      if(ai){
          drawChess(position,'black');
          if(check(position,'black')>=5){
              alert('黑棋赢');
              $(canvas).off('click');
              whiteOne=1;
              blackOne=1;
              clearInterval(t1);
              clearInterval(t2);
              document.getElementById('whiteTime').innerHTML="00:00";
              document.getElementById('blackTime').innerHTML="00:00";
              if(confirm('是否生成棋谱')){
                  review();
              }
              return;
          }
          drawChess(AI(),'white');
         // setTimeout(drawChess(AI(),'white'),5000) ;
          // setTimeout(miao,5000)
          if(check(AI(),'white')>5){

              alert('白棋赢');
              $(canvas).off('click');
              whiteOne=1;
              blackOne=1;
              clearInterval(t1);
              clearInterval(t2);
              document.getElementById('whiteTime').innerHTML="00:00";
              document.getElementById('blackTime').innerHTML="00:00";
              if(confirm('是否生成棋谱')){
                  review();
              }
              return;
          }
          return;
      }

      if(flag){
         /* miao(shu);
          shu++;*/
            // clearInterval(m);
       drawChess(position,'black');
          // t=setInterval(miao(shu),1000);
          if(check(position,'black')>=5){

       alert('黑棋赢');
       $('canvas').off('click');
              whiteOne=1;
              blackOne=1;
              clearInterval(t1);
              clearInterval(t2);
              document.getElementById('whiteTime').innerHTML="00:00";
              document.getElementById('blackTime').innerHTML="00:00";
       if(confirm('是否生成棋谱')){
       review();
       }
       return;
       }
       }else{
          // clearInterval(t);
          // m=setInterval(miao2,1000);
          drawChess(position,'white');
       if(check(position,'white')>=5){
       alert('白棋赢')
       //     $('.tankuang').animate({
       //         top:"400px"
       //     })
       $('canvas').off('click');
           whiteOne=1;
           blackOne=1;
           clearInterval(t1);
           clearInterval(t2);
           document.getElementById('whiteTime').innerHTML="00:00";
           document.getElementById('blackTime').innerHTML="00:00";
       if(confirm('是否生成棋谱')){
       review();
       }
       return;
       }
       }
       flag=!flag;
  }
    function restart(){
        ctx.clearRect(0,0,600,600);
        block={};
        console.log(block);
        flag=true;
        $('canvas').off('click').on('click',handleClick);
        draw();
        whiteOne=1;
        blackOne=1;
        clearInterval(t1);
        clearInterval(t2);
        document.getElementById('whiteTime').innerHTML="00:00";
        document.getElementById('blackTime').innerHTML="00:00";

    }
    $('.start').on('click',function(){
        // $('.start').fadeToggle();
        // $('#canvas').addClass('add');
        // $('#canvas').fadeIn();
        $('.kuang').fadeIn().delay(1000).fadeOut();
        startClick();
        // t=setInterval(miao,1000);
        audioc.play();
        /*miao();
        miao2();*/
    })
    $('.res').on('click',function(){
        // $('.start').fadeToggle();
        $('.rekuang').fadeIn().delay(1000).fadeOut();

        restart();
    })
    $('.ai').on('click',function(){
        ai=!ai;
        restart();
        startClick();
        $('.renjik').fadeIn().delay(1000).fadeOut();

        $(this).toggleClass('active');

    })
    function AI(){
        var max1=-Infinity;
        var pos1;
        var max2=-Infinity;
        var pos2;
        for(var i in blank){
           var score1= check(k2o(i),'black');
            if(score1>max1){
                max1=score1;
                pos1=k2o(i);
                // console.log(score1)

            }
            // console.log(score1)

        }
        for(var i in blank){
            var score2= check(k2o(i),'white');
            if(score2>max2){
                max2=score2;
                pos2=k2o(i);
            }
        }
        if(max2>=max1){
            return pos2;
        }else{
            return pos1;
        }
    }

   /* function miao(shu){
        biao.clearRect(0,0,80,82);
        biao.save();
        biao.translate(40,41)
      /!*  var date=new Date();
        var s=date.getSeconds();*!/

        biao.rotate(2*Math.PI*shu/60);
        biao.beginPath();
        biao.moveTo(0,0);
        biao.lineTo(0,-21);
        biao.stroke();
        biao.closePath();
        biao.restore();
    }
    miao();

    function miao2(){
        biao.clearRect(0,0,80,82);
        biao2.save();
        biao2.translate(40,41)
       /!* var date=new Date();
        var s=date.getSeconds();*!/
        biao2.rotate(2*Math.PI/60);
        biao2.beginPath();
        biao2.moveTo(0,0);
        biao2.lineTo(0,-21);
        biao2.stroke();
        biao2.closePath();
        biao2.restore();
    }
    miao2();*/
$('.hui').on('click',function(){
    $('.huibox').slideToggle();
})


})