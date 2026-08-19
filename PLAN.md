# Kịch Bản Thiết Kế Giao Diện & Trải Nghiệm Mới cho Thiệp Sinh Nhật VV

Dựa trên yêu cầu của bạn, chúng ta sẽ "đập đi xây lại" hoàn toàn trải nghiệm web hiện tại, biến nó từ một trang web tĩnh thành một **Hành trình cảm xúc (Cinematic Journey)** mang đậm tính điện ảnh và bất ngờ. 

Dưới đây là kịch bản trải nghiệm từng giây một (User Flow) để bạn xét duyệt.

---

## 🎵 Kịch Bản Âm Thanh (Gợi ý nhạc)
Âm thanh là linh hồn của sự bất ngờ. Kịch bản yêu cầu 2 giai đoạn nhạc:
1. **Giai đoạn Đếm ngược (Hồi hộp):** Hiệu ứng âm thanh nhịp tim đập (Heartbeat) dồn dập.
2. **Giai đoạn Bùng nổ (Vui tươi/Cảm xúc):** 
   - Bài hát chính thức: `music/hpbd.mp3`
   - Sẽ được kích hoạt ngay khi bộ đếm ngược kết thúc.

---

## 🎬 Kịch Bản Trải Nghiệm (Từng bước hiển thị)

### 1. Màn Khởi Đầu (The Mystery Gate)
- **Giao diện:** Toàn bộ màn hình tối đen huyền bí. Ở giữa là một đốm sáng lấp lánh.
- **Tương tác:** Có một nút bấm phát sáng nhịp nhàng với dòng chữ: *"Dành riêng cho VV. Hãy bật loa to lên và chạm vào đây..."*
- **Hành động:** Khi người dùng click, chuyển sang Cảnh Đếm Ngược.

### 2. Cảnh Đếm Ngược 3-2-1 (The Countdown)
- **Giao diện:** Màn hình vẫn tối, bắt đầu nổi nhạc hồi hộp.
- **Hiệu ứng:** Số đếm ngược to, rõ, chớp nháy giữa màn hình, đan xen là các dòng chữ xuất hiện và biến mất thật nhanh (Hiệu ứng gõ chữ - Typewriter).
  - Khung hình 1: Số **3**... -> *"Một ngày đặc biệt..."*
  - Khung hình 2: Số **2**... -> *"Dành cho một người vô cùng đặc biệt..."*
  - Khung hình 3: Số **1**... -> *"Tuổi 21 rực rỡ bắt đầu!"*

### 3. Cảnh Bùng Nổ (The Gradual Reveal)
- **Âm nhạc:** Nhạc `music/hpbd.mp3` bắt đầu vang lên.
- **Hiệu ứng & Giao diện (Xuất hiện từ từ):** 
  - Màn hình chớp sáng nhẹ, nền trời rạng rỡ (Pastel hồng/cam) với các khối cầu ánh sáng mờ ảo hiện ra.
  - Sau đó 0.5s: **Dải cờ (Bunting)** từ từ rủ xuống từ cạnh trên.
  - Sau đó 1.5s: **Bánh kem 3D** và dòng chữ **"HAPPY 21ST BIRTHDAY, VV!"** từ từ hiện lên ở trung tâm.
  - Sau đó 2.5s: **Bóng bay bóng bẩy 3D** từ dưới bay vút lên trời. Một số quả bóng bay sẽ mang theo một **mẩu giấy nhỏ (lời chúc)** đung đưa bên dưới.
  - Cùng lúc: Hàng loạt **Kim tuyến (Sparkles)** lấp lánh xuất hiện xung quanh.
  - **Tương tác phụ:** Khi người dùng tinh mắt và click vào "mẩu giấy" đang bay, một cửa sổ bật lên (Modal) tuyệt đẹp sẽ hiện ra kèm một lời chúc ngẫu nhiên và chùm pháo giấy bắn nhẹ lên.

### 4. Tương tác Thổi Nến & Điều Ước (Interactive Core)
- **Giao diện:** 
  - Ở giữa là chiếc bánh sinh nhật 3 tầng siêu to với ngọn nến lung linh.
  - Phía dưới bánh xuất hiện dòng chữ: *"Hãy nhắm mắt lại và ước một điều ước nhé... ✨"*
  - Ngay bên dưới là một nút bấm rực sáng (Glowing Button) với nội dung: **"Thổi Nến 🌬️"**
- **Hành động:** Khi click vào nút "Thổi Nến" -> Nút và lời nhắn biến mất -> Lửa tắt -> Pháo giấy nổ nhẹ và một cuốn "Nhật ký tuổi 21" rơi xuống góc màn hình. Bảng hướng dẫn hiện lên: *"Nhấp để mở nhật ký"*.

### 5. Gửi Gắm Lời Chúc (Nhật ký tuổi 21)
Thay vì thiệp, người dùng sẽ lật mở một **Cuốn Sổ Tay 3D**. Khi mở sổ ra, hai trang sách sẽ hiển thị song song:
- **Trang bên trái:** Khung ảnh Polaroid chứa hình ảnh xinh đẹp/kỷ niệm của VV.
- **Trang bên phải:** Lời chúc chân thành được viết tay.

*Nội dung cuốn sổ (Draft - Bạn có thể thay ảnh và chữ):*
> **Trang 1 (Bìa):** "Nhật ký tuổi 21 - VV - 03.09.2005"
> 
> **Trang 2 & 3 (Mở ra):** 
> - *Trái:* [Hình ảnh VV cười thật tươi]
> - *Phải:* "Chúc mừng VV chính thức bước sang tuổi 21! Cột mốc đánh dấu sự trưởng thành, rực rỡ và xinh đẹp nhất của thanh xuân. Mong rằng tuổi mới của cậu sẽ tràn ngập tiếng cười và tự do bay cao như những quả bóng bay ngoài kia."
>
> **Trang 4 & 5 (Lật trang):**
> - *Trái:* [Hình ảnh VV ngầu/đáng yêu]
> - *Phải:* "Hãy cứ mạnh mẽ, tự tin bước đi trên con đường cậu chọn nhé. Dù có chuyện gì, mong những điều tốt đẹp và bình an nhất sẽ luôn đồng hành cùng cậu. Happy Birthday! ✨"

---

## 🏁 Bước Cuối Cùng Dành Cho Bạn (Final Steps)

Kịch bản và code đã được hoàn thiện 100%. Để món quà này mang dấu ấn cá nhân nhất, bạn chỉ cần thực hiện 2 bước nhỏ sau:

> [!TIP]
> **1. Thay ảnh thật của VV:**
> Trong file `index.html`, tôi đang để 2 link ảnh tạm (ảnh icon hoạt hình). Bạn hãy tìm dòng code `<img src="https://cdn-icons-png.flaticon.com/...` và thay thế đường link đó bằng hình ảnh thật của VV nhé. Bạn có thể chép ảnh vào thư mục dự án (ví dụ `images/vv1.jpg`) rồi đổi `src="images/vv1.jpg"`.
> 
> **2. Hosting / Đưa web lên mạng:**
> Để gửi cho VV xem trên điện thoại dễ dàng, bạn có thể đẩy toàn bộ thư mục code này lên GitHub Pages hoặc Vercel (đây đều là các nền tảng miễn phí và rất dễ sử dụng).
