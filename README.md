# Puppeteer Extra Multi Profile Proxy

🕵️ **Tự động hóa trình duyệt với nhiều profile & proxy** sử dụng Puppeteer và Puppeteer-extra. Dự án hỗ trợ quản lý nhiều trình duyệt riêng biệt với các cấu hình khác nhau, lý tưởng cho các tác vụ như scraping, automation, kiểm thử hoặc bot tương tác.

## 🚀 Tính năng

- Chạy nhiều trình duyệt Chrome với các **profile người dùng riêng biệt**
- Hỗ trợ **proxy riêng cho từng profile**
- Tích hợp **`puppeteer-extra`** và các plugin như Stealth để tránh bị phát hiện

---

## 🧰 Công nghệ sử dụng

- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [puppeteer-extra](https://github.com/berstend/puppeteer-extra)
- [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth)
- Node.js
---

## ⚙️ Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/thaihunghung/Puppeteer_extra_muti_profile_proxy.git
cd Puppeteer_extra_muti_profile_proxy scr
npm install
node app.js
```

### 2. Quy trình hoạt động

#### **App chính (ví dụ: `app.js`)**

- Đọc cấu hình, dữ liệu tài khoản, proxy, nhiệm vụ từ file hoặc database.
- Khởi tạo nhiều worker (tối đa theo `MAX_THREADS` trong `.env`).
- Truyền dữ liệu cấu hình (profile, proxy, nhiệm vụ, ...) cho từng worker qua `workerData`.
- Theo dõi trạng thái các worker, nhận kết quả trả về (thành công/thất bại).

#### **Worker (`scr/worker/worker.js`)**

- Nhận dữ liệu cấu hình từ `workerData`.
- Khởi tạo trình duyệt Chrome với profile, proxy, extension riêng biệt thông qua `BrowserService.launchBrowserWithProfile`.
- Thực hiện các tác vụ tự động hóa (ví dụ: đăng nhập Twitter, mở trang web, thao tác với extension, v.v.).
- Theo dõi trạng thái trình duyệt, nếu bị đóng hoặc hoàn thành thì gửi kết quả về cho app chính qua `parentPort`.
- Đóng trình duyệt và giải phóng tài nguyên khi hoàn thành hoặc gặp lỗi.

---

### 3. Luồng xử lý của một worker

1. **Chờ đến lượt chạy** (nếu cần delay hoặc phân phối tài nguyên).
2. **Khởi tạo trình duyệt** với profile, proxy, extension tương ứng.
3. **Thực hiện nhiệm vụ** (ví dụ: đăng nhập, thao tác web, lấy dữ liệu...).
4. **Theo dõi trạng thái**: Nếu trình duyệt bị đóng hoặc hoàn thành nhiệm vụ, gửi thông báo về app chính.
5. **Đóng trình duyệt** nếu được yêu cầu hoặc khi kết thúc.

## Chú ý:
## 🧩 Nếu chưa tải Chrome

Trong thư mục `Puppeteer_extra_muti_profile_proxy`, chạy lệnh sau để tải Chrome phiên bản `116.0.5793.0`:

```bash
npx @puppeteer/browsers install chrome@116.0.5793.0

```
Sau đó thay đổi env trong scr/.env

```bash
CHROME_PATH = .\\chrome\\win64-116.0.5793.0\\chrome-win64\\chrome.exe

```


