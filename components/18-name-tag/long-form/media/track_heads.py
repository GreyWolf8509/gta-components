import cv2, numpy as np, json, sys
N=129
frames=[cv2.imread('f%03d.png'%(i+1)) for i in range(N)]
gray=[cv2.cvtColor(f,cv2.COLOR_BGR2GRAY) for f in frames]
# (name, head centre x,y, half size of template)
T=[('franklin',758,318,58),('plaid',900,437,20),('bmx',1213,488,22)]
out={}
for name,x,y,hs in T:
    pts=[(x,y)]
    tpl=gray[0][y-hs:y+hs, x-hs:x+hs].astype(np.float32)
    tpl0=tpl.copy()
    cx,cy=x,y
    for i in range(1,N):
        g=gray[i].astype(np.float32); R=int(hs*1.2)+20
        x0=max(0,cx-hs-R); y0=max(0,cy-hs-R); x1=min(1920,cx+hs+R); y1=min(1080,cy+hs+R)
        win=g[y0:y1,x0:x1]
        res=cv2.matchTemplate(win,tpl,cv2.TM_CCOEFF_NORMED)
        _,mv,_,ml=cv2.minMaxLoc(res)
        nx=x0+ml[0]+hs; ny=y0+ml[1]+hs
        cx,cy=nx,ny; pts.append((cx,cy))
        new=g[cy-hs:cy+hs, cx-hs:cx+hs]
        if new.shape==tpl.shape: tpl=0.7*tpl+0.3*new
    out[name]=pts
json.dump(out,open('raw.json','w'))
# visual check
for i in range(0,N,8):
    f=frames[i].copy()
    for name,_,_,hs in T:
        x,y=out[name][i]; cv2.rectangle(f,(x-hs,y-hs),(x+hs,y+hs),(0,255,255),2); cv2.putText(f,name,(x-hs,y-hs-6),0,0.8,(0,255,255),2)
    cv2.imwrite('chk%03d.jpg'%i, f[150:700,500:1500])
