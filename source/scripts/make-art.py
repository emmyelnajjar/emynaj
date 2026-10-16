# Original illustrations for the EMYNAJ site (drawn in code, free to use).
import random, math, os, sys
OUT = sys.argv[1]
INK='#211b16'; NAVY='#362c21'; TERRA='#c1663f'; GOLD='#d98358'; PAPER='#f3ead9'; SAND='#c9bc9e'

def save(name, w, h, body, defs=''):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice"><defs>{defs}</defs>{body}</svg>'
    open(os.path.join(OUT, name), 'w').write(svg)
    print(name, len(svg)//1024, 'KB')

def stars(r, w, h, n, maxy):
    return ''.join(f'<circle cx="{r.uniform(0,w):.0f}" cy="{r.uniform(0,maxy):.0f}" r="{r.choice([0.8,1,1.2,1.6]):.1f}" fill="{PAPER}" opacity="{r.uniform(.25,.8):.2f}"/>' for _ in range(n))

def windows(r, x, y, bw, bh, density=.35, color=GOLD):
    out=[]; step=10
    for wy in range(int(y+12), int(y+bh-8), 14):
        for wx in range(int(x+5), int(x+bw-6), step):
            if r.random()<density:
                out.append(f'<rect x="{wx}" y="{wy}" width="4" height="6" fill="{color}" opacity="{r.uniform(.35,.95):.2f}"/>')
    return ''.join(out)

# ---------------- Dubai skyline at dusk ----------------
def dubai():
    r=random.Random(7); W,H=1600,1000; base=760
    defs=f'''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1714"/><stop offset=".45" stop-color="#4a2c22"/><stop offset=".75" stop-color="#b85a35"/><stop offset="1" stop-color="#f0a46e"/></linearGradient>
<radialGradient id="sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd9a8"/><stop offset=".5" stop-color="#f4a067" stop-opacity=".9"/><stop offset="1" stop-color="#f4a067" stop-opacity="0"/></radialGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b3a26"/><stop offset="1" stop-color="#171210"/></linearGradient>
<linearGradient id="far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4632"/><stop offset="1" stop-color="#5a3528"/></linearGradient>'''
    b=[f'<rect width="{W}" height="{H}" fill="url(#sky)"/>', stars(r,W,H,90,330),
       f'<circle cx="980" cy="640" r="260" fill="url(#sun)"/>', f'<circle cx="980" cy="660" r="95" fill="#ffd2a0" opacity=".9"/>']
    # far skyline
    x=0
    while x<W:
        bw=r.randint(30,80); bh=r.randint(60,190)
        b.append(f'<rect x="{x}" y="{base-bh}" width="{bw}" height="{bh}" fill="url(#far)" opacity=".75"/>'); x+=bw+r.randint(0,6)
    # mid skyline with windows
    x=-20; mid=[]
    while x<W:
        bw=r.randint(40,95); bh=r.randint(120,330)
        if 1080<x<1300: bh=r.randint(90,170)
        top=base-bh; shape=r.random()
        if shape<.3:
            mid.append(f'<path d="M{x} {base} V{top+20} L{x+bw/2} {top} L{x+bw} {top+20} V{base} Z" fill="#3a241c"/>')
        elif shape<.5:
            mid.append(f'<path d="M{x} {base} V{top} Q{x+bw} {top} {x+bw} {top+bh*.35} V{base} Z" fill="#3a241c"/>')
        else:
            mid.append(f'<rect x="{x}" y="{top}" width="{bw}" height="{bh}" fill="#3a241c"/>')
        mid.append(windows(r,x,top,bw,bh,.28)); x+=bw+r.randint(4,14)
    b+=mid
    # Burj Khalifa (stepped spire)
    cx=1190; g=['<g fill="#2a1a14">']
    tiers=[(70,base,base-180),(56,base-180,base-330),(44,base-330,base-460),(32,base-460,base-560),(22,base-560,base-640),(14,base-640,base-700)]
    for hw,y0,y1 in tiers: g.append(f'<rect x="{cx-hw}" y="{y1}" width="{hw*2}" height="{y0-y1}"/>')
    g.append(f'<path d="M{cx-8} {base-700} L{cx} {base-860} L{cx+8} {base-700} Z"/>'); g.append('</g>')
    b+=g; b.append(windows(r,cx-60,base-640,120,620,.22,'#ffcf9a'))
    b.append(f'<circle cx="{cx}" cy="{base-862}" r="3" fill="#ff8a5c"><animate attributeName="opacity" values="1;.2;1" dur="2.4s" repeatCount="indefinite"/></circle>')
    # Burj Al Arab sail on the left by the water
    sx=260; b.append(f'<path d="M{sx} {base} L{sx} {base-360} Q{sx+150} {base-250} {sx+170} {base} Z" fill="#2a1a14"/>')
    b.append(f'<path d="M{sx+6} {base-20} L{sx+6} {base-330} Q{sx+120} {base-240} {sx+150} {base-20} Z" fill="none" stroke="{GOLD}" stroke-width="2" opacity=".55"/>')
    b.append(f'<line x1="{sx}" y1="{base-360}" x2="{sx}" y2="{base-410}" stroke="#2a1a14" stroke-width="5"/>')
    # sea + reflections
    b.append(f'<rect y="{base}" width="{W}" height="{H-base}" fill="url(#sea)"/>')
    for i in range(36):
        y=base+8+i*7; w=r.randint(40,240); xx=r.randint(700,1250)
        b.append(f'<rect x="{xx}" y="{y}" width="{w}" height="2" fill="#ffc48e" opacity="{max(.05,.55-i*.014):.2f}"/>')
    for i in range(50):
        b.append(f'<rect x="{r.randint(0,W)}" y="{r.randint(base+6,H)}" width="{r.randint(8,40)}" height="1.5" fill="{GOLD}" opacity="{r.uniform(.08,.3):.2f}"/>')
    save('dubai.svg',W,H,''.join(b),defs)

# ---------------- Egypt: pyramids, palms, Red Sea at night ----------------
def egypt():
    r=random.Random(11); W,H=1600,1000; base=700
    defs='''<linearGradient id="esky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14100e"/><stop offset=".55" stop-color="#3b2620"/><stop offset="1" stop-color="#9b5236"/></linearGradient>
<linearGradient id="pyrL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d98358"/><stop offset="1" stop-color="#a65233"/></linearGradient>
<linearGradient id="pyrD" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a3123"/><stop offset="1" stop-color="#3a2219"/></linearGradient>
<linearGradient id="dune" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d4630"/><stop offset="1" stop-color="#2a1a14"/></linearGradient>
<linearGradient id="rsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f4446"/><stop offset="1" stop-color="#121514"/></linearGradient>
<radialGradient id="moonglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f3ead9" stop-opacity=".35"/><stop offset="1" stop-color="#f3ead9" stop-opacity="0"/></radialGradient>'''
    b=[f'<rect width="{W}" height="{H}" fill="url(#esky)"/>', stars(r,W,H,160,520),
       '<circle cx="1260" cy="210" r="160" fill="url(#moonglow)"/>',
       '<path d="M1290 150 a70 70 0 1 0 0 130 a56 56 0 1 1 0 -130 Z" fill="#f3ead9"/>']
    def pyramid(cx, half, h):
        return (f'<path d="M{cx-half} {base} L{cx} {base-h} L{cx+half*.25} {base} Z" fill="url(#pyrL)"/>'
                f'<path d="M{cx} {base-h} L{cx+half} {base} L{cx+half*.25} {base} Z" fill="url(#pyrD)"/>')
    b+=[pyramid(330,190,230), pyramid(640,280,340), pyramid(920,150,170)]
    # brick lines on big pyramid
    for i in range(1,14):
        y=base-i*24; t=i*24/340; half=280*(1-t)
        b.append(f'<line x1="{640-half:.0f}" y1="{y}" x2="{640+half*.25*(1-t)+0:.0f}" y2="{y}" stroke="#8a4329" stroke-width="1" opacity=".35"/>')
    b.append(f'<path d="M0 {base} Q300 {base-40} 700 {base+10} T1600 {base-20} V{H} H0 Z" fill="url(#dune)"/>')
    # Red Sea band
    b.append(f'<path d="M980 {base+40} Q1300 {base+20} 1600 {base+30} V{H} H860 Q900 {base+120} 980 {base+40} Z" fill="url(#rsea)"/>')
    for i in range(24):
        y=base+50+i*10; b.append(f'<rect x="{1150+r.randint(-60,60)}" y="{y}" width="{r.randint(30,160)}" height="2" fill="#f3ead9" opacity="{max(.05,.4-i*.015):.2f}"/>')
    # palms
    def palm(x,y,s,flip=1):
        p=[f'<path d="M{x} {y} q{12*flip*s} {-90*s} {4*flip*s} {-180*s}" stroke="#1a1210" stroke-width="{9*s:.1f}" fill="none" stroke-linecap="round"/>']
        tx,ty=x+4*flip*s,y-180*s
        for a in [-150,-120,-80,-40,-10,20]:
            rad=math.radians(a); ex=tx+math.cos(rad)*90*s; ey=ty+math.sin(rad)*60*s+30*s
            p.append(f'<path d="M{tx:.0f} {ty:.0f} Q{(tx+ex)/2:.0f} {ty-35*s:.0f} {ex:.0f} {ey:.0f}" stroke="#1a1210" stroke-width="{7*s:.1f}" fill="none" stroke-linecap="round"/>')
        return ''.join(p)
    b+=[palm(110,H-40,1.5,1), palm(210,H-10,1.1,-1), palm(1480,H-60,1.3,-1)]
    b.append(f'<path d="M0 {H-90} Q400 {H-150} 800 {H-80} T1600 {H-100} V{H} H0 Z" fill="#1a1210"/>')
    save('egypt.svg',W,H,''.join(b),defs)

# ---------------- Airplane window with clouds ----------------
def sky():
    r=random.Random(3); W,H=900,1100
    defs='''<linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a52"/><stop offset=".5" stop-color="#c46a45"/><stop offset="1" stop-color="#f6b980"/></linearGradient>
<linearGradient id="frame" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#efe5d3"/><stop offset="1" stop-color="#c9bc9e"/></linearGradient>
<clipPath id="win"><rect x="230" y="200" width="440" height="640" rx="220"/></clipPath>
<radialGradient id="wsun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff1d6"/><stop offset="1" stop-color="#fff1d6" stop-opacity="0"/></radialGradient>'''
    b=[f'<rect width="{W}" height="{H}" fill="#2b221b"/>',
       '<rect x="150" y="120" width="600" height="800" rx="300" fill="url(#frame)"/>',
       '<rect x="200" y="170" width="500" height="700" rx="250" fill="#b9ab8e"/>',
       '<g clip-path="url(#win)"><rect x="230" y="200" width="440" height="640" fill="url(#wsky)"/>',
       '<circle cx="520" cy="560" r="160" fill="url(#wsun)"/>']
    for i in range(14):
        cx=r.randint(180,720); cy=r.randint(560,860); s=r.uniform(.6,1.4)
        b.append(f'<g class="cloud" opacity="{r.uniform(.6,.95):.2f}" fill="#fbe3c8">' + ''.join(
            f'<circle cx="{cx+dx*s:.0f}" cy="{cy+dy*s:.0f}" r="{rr*s:.0f}"/>' for dx,dy,rr in [(-50,10,34),(0,-8,46),(52,6,36),(20,18,34),(-20,22,30)]) + '</g>')
    b.append('<path d="M230 700 L670 610 L670 650 L230 760 Z" fill="#3a2a22" opacity=".9"/>')  # wing
    b.append('<path d="M640 600 L670 560 L670 615 Z" fill="#c1663f"/>')
    b.append('</g><rect x="230" y="200" width="440" height="640" rx="220" fill="none" stroke="#8e7f63" stroke-width="6"/>')
    b.append('<rect x="250" y="215" width="400" height="120" rx="60" fill="#efe5d3" opacity=".9"/>')  # half-open shade
    b.append('<rect x="420" y="315" width="60" height="10" rx="5" fill="#9c8b6c"/>')
    save('sky.svg',W,H,''.join(b),defs)

# ---------------- Luxury boutique arch ----------------
def boutique():
    W,H=900,1100
    defs='''<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f3221"/><stop offset="1" stop-color="#1e1813"/></linearGradient>
<radialGradient id="spot" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffe2b8" stop-opacity=".55"/><stop offset=".6" stop-color="#ffe2b8" stop-opacity="0"/></radialGradient>
<linearGradient id="bag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e08a5c"/><stop offset="1" stop-color="#9e4a2c"/></linearGradient>'''
    b=[f'<rect width="{W}" height="{H}" fill="url(#wall)"/>',
       '<path d="M170 1000 V420 a280 280 0 0 1 560 0 V1000 Z" fill="#2a2018" stroke="#c1663f" stroke-width="3"/>',
       '<path d="M200 1000 V430 a250 250 0 0 1 500 0 V1000 Z" fill="#191410"/>',
       '<path d="M450 170 L270 1000 H630 Z" fill="url(#spot)"/>',
       '<rect x="330" y="760" width="240" height="240" fill="#3a2d22"/><rect x="320" y="750" width="260" height="20" fill="#c9bc9e"/>',
       '<path d="M390 600 q60 -110 120 0" fill="none" stroke="#c9bc9e" stroke-width="10" stroke-linecap="round"/>',
       '<path d="M350 610 H550 L575 750 H325 Z" fill="url(#bag)"/>',
       '<rect x="430" y="640" width="40" height="22" rx="4" fill="#f3ead9" opacity=".85"/>',
       '<path d="M350 610 H550" stroke="#f3ead9" stroke-width="2" opacity=".5"/>',
       '<g fill="#d98358" opacity=".8"><circle cx="300" cy="300" r="3"/><circle cx="610" cy="340" r="2"/><circle cx="560" cy="260" r="2.5"/><circle cx="340" cy="470" r="2"/></g>',
       '<rect x="0" y="1000" width="900" height="100" fill="#120e0b"/><path d="M0 1000 H900" stroke="#c1663f" stroke-width="2" opacity=".6"/>']
    save('boutique.svg',W,H,''.join(b),defs)

# ---------------- Training stage ----------------
def stage():
    r=random.Random(5); W,H=900,1100
    defs='''<radialGradient id="beam" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd7a6" stop-opacity=".6"/><stop offset=".7" stop-color="#ffd7a6" stop-opacity="0"/></radialGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2c20"/><stop offset="1" stop-color="#1a1310"/></linearGradient>'''
    b=[f'<rect width="{W}" height="{H}" fill="#1c1612"/>',
       '<path d="M450 0 L180 760 H720 Z" fill="url(#beam)"/>',
       '<ellipse cx="450" cy="760" rx="300" ry="50" fill="#d98358" opacity=".25"/>',
       '<rect y="740" width="900" height="360" fill="url(#floor)"/>',
       '<path d="M400 560 H500 L520 760 H380 Z" fill="#2c211a" stroke="#c1663f" stroke-width="2"/>',
       '<rect x="390" y="548" width="120" height="16" rx="3" fill="#c9bc9e"/>',
       '<path d="M450 548 V470" stroke="#9c8b6c" stroke-width="5"/><rect x="438" y="440" width="24" height="40" rx="12" fill="#3a2d22" stroke="#c9bc9e" stroke-width="2"/>']
    for row,(y,n,s) in enumerate([(930,7,1.0),(1030,8,1.2)]):
        for i in range(n):
            x=60+i*(780/(n-1))+r.randint(-15,15)
            b.append(f'<g fill="#0f0c0a"><circle cx="{x:.0f}" cy="{y-40*s:.0f}" r="{26*s:.0f}"/><path d="M{x-48*s:.0f} {y+40*s:.0f} q{48*s:.0f} {-100*s:.0f} {96*s:.0f} 0 Z"/></g>')
    b.append('<g fill="#f3ead9" opacity=".7">' + ''.join(f'<circle cx="{r.randint(200,700)}" cy="{r.randint(80,600)}" r="{r.choice([1,1.4,2])}"/>' for _ in range(40)) + '</g>')
    save('stage.svg',W,H,''.join(b),defs)

dubai(); egypt(); sky(); boutique(); stage()
