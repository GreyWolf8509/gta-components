# Point tracker for the callout anchors (LK optical flow on a feature patch, forward and backward from a seed frame).
# usage: /usr/bin/python3 track.py <video> <seedFrame> <x> <y> <box> <f0> <f1>  -> prints JSON [[x,y],...] for frames f0..f1
import cv2, numpy as np, sys, json
vid, sf, sx, sy, box, f0, f1 = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), int(sys.argv[5]), int(sys.argv[6]), int(sys.argv[7])
cap = cv2.VideoCapture(vid); frames = []
while True:
    ok, im = cap.read()
    if not ok: break
    frames.append(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY))
n = len(frames); f1 = min(f1, n - 1)
lk = dict(winSize=(31, 31), maxLevel=4, criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 40, 0.01))
def feats(g, x, y):
    m = np.zeros_like(g); h = box // 2
    cv2.rectangle(m, (int(x - h), int(y - h)), (int(x + h), int(y + h)), 255, -1)
    p = cv2.goodFeaturesToTrack(g, maxCorners=80, qualityLevel=0.01, minDistance=5, mask=m)
    return p
def run(step):
    pos = {sf: (sx, sy)}; x, y = sx, sy; f = sf; p = feats(frames[f], x, y)
    while (f + step) >= f0 and (f + step) <= f1:
        g0, g1 = frames[f], frames[f + step]
        if p is None or len(p) < 8: p = feats(g0, x, y)
        q, st, _ = cv2.calcOpticalFlowPyrLK(g0, g1, p, None, **lk)
        r, st2, _ = cv2.calcOpticalFlowPyrLK(g1, g0, q, None, **lk)
        fb = np.linalg.norm((p - r).reshape(-1, 2), axis=1)
        good = (st.ravel() == 1) & (st2.ravel() == 1) & (fb < 1.0)
        if good.sum() >= 4:
            d = np.median((q - p).reshape(-1, 2)[good], axis=0)
            x, y = x + d[0], y + d[1]
            p = q[good].reshape(-1, 1, 2)
            # drop points that drifted away from the patch
            keep = np.max(np.abs(p.reshape(-1, 2) - [x, y]), axis=1) < box * 0.7
            p = p[keep]
        f += step; pos[f] = (x, y)
        if f % 6 == 0: p = feats(frames[f], x, y)
    return pos
pos = run(1); pos.update(run(-1))
print(json.dumps([[round(float(pos[i][0]), 1), round(float(pos[i][1]), 1)] for i in range(f0, f1 + 1)]))
