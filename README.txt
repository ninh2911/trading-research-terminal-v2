TRADING RESEARCH TERMINAL v2
============================

Yeu cau: Node.js 18 tro len.

1) Tao file .env tu .env.example
   Windows PowerShell:
     Copy-Item .env.example .env

2) Mo file .env va thay PASTE_YOUR_NEW_KEY_HERE bang API key MOI.
   Khong gui file .env cho nguoi khac, khong commit len GitHub.

3) Chay server:
   Mo thu muc trading_research_terminal_v2\trading_research_terminal_v2 trong VS Code
   (thu muc co cac file server.js, index.html va .env.example).
   Mo Terminal moi trong VS Code, sau do chay:
     node server.js
   De nguyen cua so Terminal trong khi su dung. Khi thay dong
   "Trading Research Terminal: http://localhost:3000", server da chay.
   Neu Terminal dang o thu muc codeweb ben ngoai, chay truoc:
     Set-Location .\trading_research_terminal_v2\trading_research_terminal_v2

4) Mo trang web:
     http://localhost:3000
   Khong mo index.html truc tiep bang file://. Dung Ctrl+C trong Terminal
   de dung server khi xong.

   Neu khong mo duoc trang, kiem tra server.js co nam trong thu muc hien tai
   va Terminal van dang chay. Neu bao cong 3000 dang duoc su dung, doi PORT
   trong .env sang 3001, khoi dong lai server va mo http://localhost:3001.
   Neu trang mo duoc nhung hien "API chua ket noi", kiem tra API key trong
   .env va gioi han quota Alpha Vantage; trang van co the hien du lieu minh hoa.

API duoc su dung:
- GOLD_SILVER_SPOT: gia vang spot
- GOLD_SILVER_HISTORY: lich su gia vang daily

Luu y:
- Neu Alpha Vantage bao quota/limit, doi den khi quota duoc lam moi.
- Gia spot cua Alpha Vantage co the khac gia GOLD CFD tren TradingView/broker.
- Ban nay ve lich su theo du lieu gia dong cua (close), khong phai OHLC nen khong tao nen that.
- Cac nut Buy/Sell chi la paper trading demo, khong gui lenh len san.
- Khong dua API key vao index.html hay JavaScript phia trinh duyet.
