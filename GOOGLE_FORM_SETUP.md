# Hướng dẫn tích hợp Google Form

## Bước 1: Tạo Google Form

1. Truy cập [Google Forms](https://forms.google.com)
2. Tạo form mới với các câu hỏi:
   - **Họ và tên** (Câu hỏi ngắn)
   - **Số điện thoại/Zalo** (Câu hỏi ngắn) 
   - **Mục tiêu học** (Câu hỏi ngắn)
   - **UTM Source** (Câu hỏi ngắn) - Ẩn
   - **UTM Campaign** (Câu hỏi ngắn) - Ẩn

## Bước 2: Lấy Form ID và Entry IDs

### Lấy Form ID:
1. Mở Google Form
2. Click "Gửi" (Send)
3. Click biểu tượng link (🔗)
4. Copy link, ví dụ: `https://docs.google.com/forms/d/e/1FAIpQLSdXXXXXXXXXXXXXXX/viewform`
5. Form ID là phần giữa `/d/e/` và `/viewform`: `1FAIpQLSdXXXXXXXXXXXXXXX`

### Lấy Entry IDs:
1. Mở Google Form
2. Click "Xem phản hồi" (View responses)
3. Click "Tạo bảng tính" (Create spreadsheet)
4. Mở bảng tính, click "Công cụ" > "Trình chỉnh sửa tập lệnh" (Script editor)
5. Paste code sau và chạy:

```javascript
function getEntryIds() {
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  
  items.forEach((item, index) => {
    console.log(`Question ${index + 1}: ${item.getTitle()}`);
    console.log(`Entry ID: ${item.getId()}`);
    console.log('---');
  });
}
```

6. Xem log để lấy Entry IDs

## Bước 3: Cập nhật code

✅ **ĐÃ CẬP NHẬT** - Code đã được cấu hình với thông tin thực tế:

```typescript
const submitToGoogleForm = async (data: Record<string, string>) => {
  const GOOGLE_FORM_ID = '1FAIpQLSf7yq2a83f-boZE0Yag2JBm593EwAkRS3AEhB4fOXJLBFxnug'
  const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`
  
  const formData = new FormData()
  formData.append('entry.888789107', data.name || '') // Họ và tên
  formData.append('entry.1587081785', data.phone || '') // Số điện thoại
  
  // Kết hợp mục tiêu với UTM data
  const goalWithUTM = `${data.goal || ''} | UTM: ${data.utm_source || 'landing'}-${data.utm_campaign || 'trial-1-1'}`
  formData.append('entry.2127657389', goalWithUTM) // Mục tiêu + UTM tracking
  
  const response = await fetch(GOOGLE_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
  
  return response
}
```

**Thông tin đã cấu hình:**
- ✅ Form ID: `1FAIpQLSf7yq2a83f-boZE0Yag2JBm593EwAkRS3AEhB4fOXJLBFxnug`
- ✅ Họ và tên: `entry.888789107`
- ✅ Số điện thoại: `entry.1587081785`
- ✅ Mục tiêu: `entry.2127657389` (kèm UTM tracking)

## Bước 4: Test

1. Chạy ứng dụng: `npm run dev`
2. Điền form và submit
3. Kiểm tra Google Form responses để xem dữ liệu đã được gửi

## ✅ Cách hoạt động mới (Form ẩn + iframe)

### **Dual Strategy:**
1. **Thử fetch trước** - Nếu không bị chặn CORS
2. **Fallback form ẩn** - Nếu fetch bị chặn

### **Ưu điểm:**
- ✅ **Tương thích cao** - Hoạt động trên mọi trình duyệt
- ✅ **Tránh CORS** - Form ẩn không bị chặn
- ✅ **Reliable** - Luôn gửi được dữ liệu
- ✅ **Auto cleanup** - Tự động dọn dẹp form sau khi gửi

### **Cách hoạt động:**
1. Tạo `<form>` ẩn với `target="gform_iframe"`
2. Tạo `<iframe>` ẩn để nhận response
3. Submit form → Google Forms xử lý
4. Tự động dọn dẹp form sau 1ms

## Lưu ý quan trọng

- **Form phải public** để có thể submit từ bên ngoài
- **Entry IDs** phải chính xác
- **UTM tracking** được kết hợp vào field "Mục tiêu"
- **Auto fallback** nếu fetch bị chặn

## Troubleshooting

### Nếu dữ liệu không được gửi:
1. Kiểm tra Form ID có đúng không
2. Kiểm tra Entry IDs có đúng không  
3. Kiểm tra Google Form có public không
4. Mở Developer Tools (F12) xem có lỗi gì không

### Debug:
- Mở Network tab trong DevTools
- Xem có request POST đến Google Forms không
- Kiểm tra iframe `gform_iframe` có được tạo không
