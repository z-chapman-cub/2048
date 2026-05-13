const size=4
let tileMap
const speed=50
let z=2
const tileSize=135;
const tileGap=15;

const overshoot=30
const inlayOvershoot=100

const inlay=document.getElementById("2048")

const inlayDims=inlay.getBoundingClientRect()
let leftOffset=25
let topOffset=25

const colorMap={
  2:'#c5af58',4:'#ffce3b',8:'#f2e39f',16:'#e5dac9',
  32:'#ffff00',64:'#bb93c6',128:'#b133b1',256:'#ec8fff',
  512:'#e0bbe3', 1024:'#c26d8a',2048:'#e5d5c3',4096:'#bdbdb9',
  8192:'#f6a9a9',
}
let wait=0

driver()

function driver(){
  init()
  
  window.addEventListener('keydown',function(e){
    setTimeout(()=>{
      requestAnimationFrame(()=>{
        moveTiles(e.key)
      })
    },wait-100)
  })
}

function set1(tile,prevVal){
  // tile.style.zIndex=(z++).toString()
  tile.label.zIndex=(z++).toString()
}

function set2(tile){
  if(!tile.v){
    tile.label.textContent=''
    tile.style.transition='none'
    tile.style.filter='none'
    tile.style.background='#1b091b'//change to visibility toggle
  }
}

function set3(tile){
  tile.style.zIndex=(z++).toString()
  tile.label.zIndex=(z++).toString()
}

function set4(tile){
  tile.style.transition='none'
  tile.style.filter='none'
}

function moveTiles(key){
  let prevVal=-1
  let o=0
  let delay=0
  let moved=false

  if(key==='ArrowUp'||key==='w'){
    for(let j=0;j<size;j++){
      prevVal=-1
      o=0

      for(let i=0;i<size;i++) {
        if(tileMap[i][j].v!==0){
          const val=tileMap[i][j].v
          
          if(val===prevVal){
            moved=true
            inlay.style.transform=`translate(-50%,-50%) translate(${0}px,${-inlayOvershoot}px)`
            setTimeout(()=> {
              inlay.style.transform=`translate(-50%,-50%)`
            },50)
            
            let k=i-(o-1)
            
            const tile1=tileMap[i][j]
            tile1.v*=2
            tile1.style.zIndex=(z++).toString()
            set1(tile1,prevVal)
            
            tile1.style.transition=`transform ${speed*k}ms linear`
            tile1.style.transform=`translate(${j*150+leftOffset}px,${-150*k+i*150+topOffset-overshoot}px)`
            
            const tile2=tileMap[o-1][j]
            tile2.v=0
            
            setTimeout(((val,i,j,k,o)=>()=>{
              tile1.style.transition='none'
              tile1.style.transform=`translate(${j*150+leftOffset}px,${-150*k+i*150+topOffset-overshoot}px) scale(0.8)`
              setTimeout(()=> {
                tile1.style.transition='transform 200ms ease'
                tile1.style.transform=`translate(${j*150+leftOffset}px,${-150*k+i*150+topOffset}px) scale(1)`
              },50)

                tile1.style.background=colorMap[val*2]
                const str=(val*2).toString()
                score.textContent=(parseInt(score.textContent)+val*2).toString()
                // tile1.textContent=str.slice(str.length-2,str.length)
                tile1.label.textContent=str.slice(str.length-2,str.length)
                
                set2(tile2)
                tile2.style.transform=`translate(${j*150+leftOffset}px,${150*k+(o-1)*150+topOffset}px)`
            })(prevVal,i,j,k,o),speed*k)
            
            swap(i,j,o-1,j)
            delay=Math.max(delay,speed*k)
            prevVal=-1
            
          }else{
            if(i-o){
              moved=true
              inlay.style.transform=`translate(-50%,-50%) translate(${0}px,${-inlayOvershoot}px)`
              setTimeout(()=> {
                inlay.style.transform=`translate(-50%,-50%)`
              },50)
              
              let k=i-o
              
              const tile1=tileMap[i][j]
              set3(tile1)
              tile1.style.transition=`transform ${speed*k}ms linear`
              tile1.style.transform=`translate(${j*150+leftOffset}px,${-150*k+i*150+topOffset-overshoot}px)`

              setTimeout(((i,j,k)=>()=>{
                tile1.style.transform=`translate(${j*150+leftOffset}px,${-150*k+i*150+topOffset}px)`
              })(i,j,k),speed*k)
              
              const tile2=tileMap[o][j]
              set4(tile2)
              tile2.style.transform=`translate(${j*150+leftOffset}px,${150*k+o*150+topOffset}px)`
              
              swap(i,j,o,j)
              
              delay=Math.max(delay,speed*k)
            }
            prevVal=val
            o++
          }
        }
      }
    }
    wait=delay
    
    if(moved){
      spawnTile()
    }

  }else if(key==='ArrowDown'||key==='s'){
    for(let j=0;j<size;j++){
      prevVal=-1
      o=0

      for(let i=(size-1);i>=0;i--) {
        if(tileMap[i][j].v!==0){//something changed; correct
          const val=tileMap[i][j].v
          
          if(val===prevVal){
            moved=true
            inlay.style.transform=`translate(-50%,-50%) translate(${0}px,${inlayOvershoot}px)`
            setTimeout(()=> {
              inlay.style.transform=`translate(-50%,-50%)`
            },50)
            
            let k=(size-1)-i-(o-1)

            const tile1=tileMap[i][j]
            tileMap[i][j].v*=2
            tile1.style.zIndex=(z++).toString()
            set1(tile1,prevVal)
            
            tile1.style.transition=`transform ${speed*k}ms linear`
            tile1.style.transform=`translate(${j*150+leftOffset}px,${150*k+i*150+topOffset+overshoot}px)`
            
            const tile2=tileMap[(size-1)-(o-1)][j]
            tile2.v=0

            setTimeout(((val,i,j,k,o)=>()=>{
              tile1.style.transition='none'
              tile1.style.transform=`translate(${j*150+leftOffset}px,${150*k+i*150+topOffset+overshoot}px) scale(0.8)`
              setTimeout(()=> {
                tile1.style.transition='transform 200ms ease'
                tile1.style.transform=`translate(${j*150+leftOffset}px,${150*k+i*150+topOffset}px) scale(1)`
              },50)
              
                tile1.style.background=colorMap[val*2]
                const str=(val*2).toString()
                score.textContent=(parseInt(score.textContent)+val*2).toString()
                // tile1.textContent=str.slice(str.length-2,str.length)
                tile1.label.textContent=str.slice(str.length-2,str.length)
                
                set2(tile2)
                tile2.style.transform=`translate(${j*150+leftOffset}px,${-150*k+((size-1)-(o-1))*150+topOffset}px)`
            })(prevVal,i,j,k,o),speed*k)

            swap(i,j,(size-1)-(o-1),j)

            delay=Math.max(delay,speed*k)
            prevVal=-1
            
          }else{
            if((size-1)-i-o){
              moved=true
              inlay.style.transform=`translate(-50%,-50%) translate(${0}px,${inlayOvershoot}px)`
              setTimeout(()=> {
                inlay.style.transform=`translate(-50%,-50%)`
              },50)
              
              let k=(size-1)-i-o

              const tile1=tileMap[i][j]
              set3(tile1)
              tile1.style.transition=`transform ${speed*k}ms linear`
              tile1.style.transform=`translate(${j*150+leftOffset}px,${150*k+i*150+topOffset+overshoot}px)`

              setTimeout(((i,j,k)=>()=>{
                tile1.style.transform=`translate(${j*150+leftOffset}px,${150*k+i*150+topOffset}px)`
              })(i,j,k),speed*k)
              
              const tile2=tileMap[(size-1)-o][j]
              set4(tile2)
              tile2.style.transform=`translate(${j*150+leftOffset}px,${-150*k+((size-1)-o)*150+topOffset}px)`
              
              swap(i,j,(size-1)-o,j)
              
              delay=Math.max(delay,speed*k)
            }
            prevVal=val
            o++
          }
        }
      }
    }
    wait=delay
    
    if(moved){
      spawnTile()
    }
    
  }else if(key==='ArrowLeft'||key==='a'){
    for(let i=0;i<size;i++){
      prevVal=-1
      o=0

      for(let j=0;j<size;j++) {
        if(tileMap[i][j].v!==0){
          const val=tileMap[i][j].v
          
          if(val===prevVal){
            moved=true
            inlay.style.transform=`translate(-50%,-50%) translate(${-inlayOvershoot}px,${0}px)`
            setTimeout(()=> {
              inlay.style.transform=`translate(-50%,-50%)`
            },50)
            
            let k=j-(o-1)

            const tile1=tileMap[i][j]
            tileMap[i][j].v*=2
            tile1.style.zIndex=(z++).toString()
            set1(tile1,prevVal)
            
            tile1.style.transition=`transform ${speed*k}ms linear`
            tile1.style.transform=`translate(${-150*k+j*150+leftOffset-overshoot}px,${i*150+topOffset}px)`
            
            const tile2=tileMap[i][o-1]
            tile2.v=0

            setTimeout(((val,i,j,k,o)=>()=>{
              tile1.style.transition='none'
              tile1.style.transform=`translate(${-150*k+j*150+leftOffset-overshoot}px,${i*150+topOffset}px) scale(0.8)`
              setTimeout(()=> {
                tile1.style.transition='transform 200ms ease'
                tile1.style.transform=`translate(${-150*k+j*150+leftOffset}px,${i*150+topOffset}px) scale(1)`
              },50)
              
                tile1.style.background=colorMap[val*2]
                const str=(val*2).toString()
                score.textContent=(parseInt(score.textContent)+val*2).toString()
                // tile1.textContent=str.slice(str.length-2,str.length)
                tile1.label.textContent=str.slice(str.length-2,str.length)
              
                
                set2(tile2)
                tile2.style.transform=`translate(${150*k+(o-1)*150+leftOffset}px,${i*150+topOffset}px)`
            })(prevVal,i,j,k,o),speed*k)

            swap(i,j,i,o-1)

            delay=Math.max(delay,speed*k)
            prevVal=-1
            
          }else{
            if(j-o){
              moved=true
              inlay.style.transform=`translate(-50%,-50%) translate(${-inlayOvershoot}px,${0}px)`
              setTimeout(()=> {
                inlay.style.transform=`translate(-50%,-50%)`
              },50)
              
              let k=j-o

              const tile1=tileMap[i][j]
              set3(tile1)
              tile1.style.transition=`transform ${speed*k}ms linear`
              tile1.style.transform=`translate(${-150*k+j*150+leftOffset-overshoot}px,${i*150+topOffset}px)`

              setTimeout(((i,j,k)=>()=>{
                tile1.style.transform=`translate(${-150*k+j*150+leftOffset}px,${i*150+topOffset}px)`
              })(i,j,k),speed*k)

              const tile2=tileMap[i][o]
              set4(tile2)
              tile2.style.transform=`translate(${150*k+o*150+leftOffset}px,${i*150+topOffset}px)`
              
              swap(i,j,i,o)

              delay=Math.max(delay,speed*k)
            }
            prevVal=val
            o++
          }
        }
      }
    }
    wait=delay
    
    if(moved){
      spawnTile()
    }

  }else if(key==='ArrowRight'||key==='d'){
    for(let i=0;i<size;i++){
      prevVal=-1
      o=0

      for(let j=(size-1);j>=0;j--) {
        if(tileMap[i][j].v!==0){
          const val=tileMap[i][j].v
          
          if(val===prevVal){
            moved=true
            inlay.style.transform=`translate(-50%,-50%) translate(${inlayOvershoot}px,${0}px)`
            setTimeout(()=> {
              inlay.style.transform=`translate(-50%,-50%)`
            },50)
            
            let k=(size-1)-j-(o-1)

            const tile1=tileMap[i][j]
            tile1.v*=2
            tile1.style.zIndex=(z++).toString()
            
            tile1.style.transition=`transform ${speed*k}ms linear`
            tile1.style.transform=`translate(${150*k+j*150+leftOffset}px,${i*150+topOffset}px)`
            
            const tile2=tileMap[i][(size-1)-(o-1)]
            tile2.v=0

            setTimeout(((val,i,j,k,o)=>()=>{
              tile1.style.transition='none'
              tile1.style.transform=`translate(${150*k+j*150+leftOffset}px,${i*150+topOffset}px) scale(0.8)`
              setTimeout(()=> {
                tile1.style.transition='transform 200ms ease'
                tile1.style.transform=`translate(${150*k+j*150+leftOffset}px,${i*150+topOffset}px) scale(1)`
              },50)
              
                tile1.style.background=colorMap[val*2]
                const str=(val*2).toString()
                score.textContent=(parseInt(score.textContent)+val*2).toString()
                // tile1.textContent=str.slice(str.length-2,str.length)
                tile1.label.textContent=str.slice(str.length-2,str.length)
                    
                set2(tile2)
                tile2.style.transform=`translate(${-150*k+((size-1)-(o-1))*150+leftOffset}px,${i*150+topOffset}px)`
            })(prevVal,i,j,k,o),speed*k)

            swap(i,j,i,(size-1)-(o-1))

            delay=Math.max(delay,speed*k)
            prevVal=-1
            
          }else{
            if((size-1)-j-o){
              moved=true
              inlay.style.transform=`translate(-50%,-50%) translate(${inlayOvershoot}px,${0}px)`
              setTimeout(()=> {
                inlay.style.transform=`translate(-50%,-50%)`
              },50)
              
              let k=(size-1)-j-o

              const tile1=tileMap[i][j]
              set3(tile1)
              tile1.style.transition=`transform ${speed*k}ms linear`
              tile1.style.transform=`translate(${150*k+j*150+leftOffset+overshoot}px,${i*150+topOffset}px)`
              
              setTimeout(((i,j,k)=>()=>{
                tile1.style.transform=`translate(${150*k+j*150+leftOffset}px,${i*150+topOffset}px)`
              })(i,j,k),speed*k)
              
              const tile2=tileMap[i][(size-1)-o]
              set4(tile2)
              tile2.style.transform=`translate(${-150*k+((size-1)-o)*150+leftOffset}px,${i*150+topOffset}px)`
              
              swap(i,j,i,(size-1)-o)

              delay=Math.max(delay,speed*k)
            }
            prevVal=val
            o++
          }
        }
      }
    }
    wait=delay
    
    if(moved){
      spawnTile()
    }
  }
}

function swap(i,j,k,l){
  const temp=tileMap[i][j]
  tileMap[i][j]=tileMap[k][l]
  tileMap[k][l]=temp
}

function init(){
  tileMap=Array.from({length: size},()=>Array(size).fill(null))
  
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      getInlayTile(i,j)
      tileMap[i][j]=getTile(i,j)
    }
  }
  spawnTile()
  spawnTile()

  // const sound=new Audio('/sounds/theme.wav')
  // sound.volume=0.5
  // sound.loop=true
  // sound.play()
}

function checkOver(){
  for(let i=0;i<size;i++){
    let prevU=0,prevD=0,prevL=0,prevR=0

    for(let j=0;j<size;j++){
      let val=tileMap[i][j].v

      if(val){
        if(val===prevD){return false;
        }else{prevD=val}
      }else{
        return false;
      }

      val=tileMap[j][i].v

      if(val){
        if(val===prevU){return false;
        }else{prevU=val}
      }else{
        return false;
      }

      val=tileMap[i][(size-1)-j].v

      if(val){
        if(val===prevL){return false;
        }else{prevL=val}
      }else{
        return false;
      }

      val=tileMap[(size-1)-j][i].v

      if(val){
        if(val===prevR){return false;
        }else{prevR=val}
      }else{return false;
      }
    }
  }
  return true;
}

function spawnTile(){
  let idx=[],jdx=[]

  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      if(!tileMap[i][j].v){
        idx.push(i);jdx.push(j)
      }
    }
  }
  
  if(idx.length){
    const k=Math.floor(Math.random()*idx.length)
    const tile=tileMap[idx[k]][jdx[k]]
    tile.v=2
    tile.style.transition='none'
    tile.style.transform=`translate(${150*jdx[k]+leftOffset}px,${150*idx[k]+topOffset}px) scale(0.2)`
    // tile.textContent='2'

    setTimeout(()=> {
      tile.label.textContent='2'
      tile.style.transition='none'
      tile.style.background='#c5af58'
      tile.style.filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))";
      
      tile.style.transition='transform 300ms ease'
      tile.style.transform=`translate(${150*jdx[k]+leftOffset}px,${150*idx[k]+topOffset}px) scale(1)`
    },wait+50)
  }
  
  setTimeout(()=> {
    if(checkOver()){//No moves after tile spawned
      gameOver()
    }
  },360)
}

function gameOver(){
  wait=4400
  
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      if(tileMap[i][j].v){
        const tile=tileMap[i][j]
        
        setTimeout(()=> {
          tile.style.transition='background-color 2000ms ease, opacity 2000ms ease'
          tile.style.background='white'
          // tile.style.opacity='0%'
          tile.label.style.transition='color 2000ms ease'
          tile.label.style.color='white'
        },(i+j)*200)
        
        setTimeout(()=> {
          tile.style.transition='background-color 600ms ease, opacity 600ms ease'
          // tile.textContent=''
          tile.label.style.transition='color 600ms ease'
          tile.label.textContent=''
          tile.style.background='#1b091b'
          tile.v=0
          // tile.style.opacity='100%'
          tile.label.style.color='#4d0d32'
        },2500+(i+j)*200)
      }
    }
  }
  highScore.textContent=Math.max(parseInt(highScore.textContent),parseInt(score.textContent)).toString()
  setTimeout(()=> {
    score.textContent='0'
    spawnTile()
    spawnTile()
    wait=0
  },4000)
}

function restart(){
  wait=1800
  
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      if(tileMap[i][j].v){
        const tile=tileMap[i][j]
        tile.style.transition='background-color 500ms ease, opacity 500ms ease'
        tile.style.background='white'
        tile.label.style.transition='color 500ms ease'
        tile.label.style.color='white'
        // tile.style.opacity='0%'
        
        setTimeout(()=> {
          tile.style.transition='background-color 300ms ease, opacity 300ms ease'
          // tile.textContent=''
          tile.label.style.transition='color 200ms ease'
          tile.label.textContent=''
          tile.style.background='#1b091b'
          tile.v=0
          // tile.style.opacity='100%'
          tile.label.style.color='#4d0d32'
        },600)
      }
    }
  }
  highScore.textContent=Math.max(parseInt(highScore.textContent),parseInt(score.textContent)).toString()
  setTimeout(()=> {
    score.textContent='0'
    spawnTile()
    spawnTile()
    wait=0
  },800)
}



function getInlayTile(i,j){
  const inlayTile=Object.assign(document.createElement('div'),{
    className:'box'
  })

  inlayTile.style.transform=`translate(${150*j+leftOffset}px,${150*i+topOffset}px)`
  inlay.appendChild(inlayTile)
}

function getTile(i,j){
  const tile=Object.assign(document.createElement('div'),{
    className:'box-active'
  })
  const labelDiv=Object.assign(document.createElement('div'), {
    className: 'label'
  })
  tile.label=labelDiv
  tile.appendChild(labelDiv)
  
  tile.style.transform=`translate(${150*j+leftOffset}px,${150*i+topOffset}px)`
  inlay.appendChild(tile)
  tile.v=0
  return tile
}

const score=document.getElementById('scoreval')
score.textContent='0'

const highScore=document.getElementById('highscoreval')
highScore.textContent='0'

const scoreDiv=document.getElementById('score')

const highScoreDiv=document.getElementById('highscore')

const restartDiv=document.getElementById('restart')

restartDiv.addEventListener("mouseenter", () => {
  restartDiv.style.background = '#443333';
  restartDiv.style.color='#b29877'
  restartDiv.style.cursor='pointer'
});

restartDiv.addEventListener("mouseleave", () => {
  restartDiv.style.background = '#302323';
  restartDiv.style.color='#73624c'
  restartDiv.style.cursor='default'
});