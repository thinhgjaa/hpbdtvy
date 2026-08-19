# Kịch Bản Thiết Kế Giao Diện & Trải Nghiệm Hoàn Hảo cho Thiệp Sinh Nhật Thanh Vy (03.09)

Dựa trên yêu cầu của bạn, chúng ta đã tối ưu hóa toàn diện trải nghiệm web, biến nó thành một **Hành trình cảm xúc (Cinematic Journey)** mang đậm tính điện ảnh, bất ngờ và ấm áp dành riêng cho **Thanh Vy**.

Dưới đây là kịch bản trải nghiệm từng giây một (User Flow) phiên bản hoàn thiện nhất.

---

## 🎵 Kịch Bản Âm Thanh & Xúc Giác (Web Audio API & Haptics)
Hệ thống âm thanh & rung được lập trình trực tiếp bằng code để đảm bảo đồng bộ hoàn hảo với tương tác:
1. **Giai đoạn Đếm ngược:** Nhạc đếm ngược hồi hộp. Khi kết thúc đếm, nhạc sẽ **fade out (nhỏ dần) êm ái** nhường chỗ cho sự tĩnh lặng.
2. **Hiệu ứng xúc giác (Haptic Feedback):** Rung nhẹ điện thoại (`navigator.vibrate`) khi kéo dây, đếm nhịp 3-2-1, đập nổ bóng bay và khi lật trang sách.
3. **Hiệu ứng tương tác:** 
   - Tiếng "Bốp" chân thực khi đập vỡ bóng bay.
   - Tiếng sột soạt mở giấy khi đập trúng bóng mang lời chúc may mắn từ Túi Thần Kỳ.
   - Tiếng sột soạt khi lật từng trang sổ 3D.
4. **Âm nhạc thông minh (Audio Ducking):** Bài hát sinh nhật bùng nổ tưng bừng khi mở màn, và tự động hạ âm lượng êm ái xuống 30% khi mở sổ đọc tâm sự để tạo không gian sâu lắng.

---

## 🎬 Kịch Bản Trải Nghiệm (Từng bước hiển thị)

### 1. Màn Khởi Đầu (The Mystery Gate)
- **Giao diện:** Toàn bộ màn hình tối đen huyền bí. Màn hình chờ (Preloader) hiển thị thanh tiến trình: *"Đang tải bảo bối từ túi thần kỳ cho Thanh Vy..."*
- **Tương tác:** Nút kéo dây (Pull Cord) nhấp nháy: *"Cánh Cửa Thần Kỳ dành cho Thanh Vy... Hãy bật loa to lên và chạm vào đây..."*
- **Hành động:** Khi kéo dây $\rightarrow$ Kích hoạt rung nhẹ + âm thanh mở khóa, chuyển sang Cảnh Đếm Ngược.

### 2. Cảnh Đếm Ngược 3-2-1 (The Cinematic Countdown)
- **Giao diện:** Màn hình tối, nhạc hồi hộp vang lên.
- **Hiệu ứng:** Số đếm ngược to chớp nháy đan xen lời nhắn gõ chữ:
  - Khung hình 1: **3**... $\rightarrow$ *"Một ngày đặc biệt..."*
  - Khung hình 2: **2**... $\rightarrow$ *"Món quà thần kỳ dành cho Thanh Vy..."*
  - Khung hình 3: **1**... $\rightarrow$ *"Bắt đầu bữa tiệc nào!"*
- **Khoảng Lặng Điện Ảnh:** Sau khi đếm xong, chữ số tắt lịm, âm thanh nhỏ dần. Màn hình rơi vào khoảng lặng hồi hộp trong 3.5 giây để đẩy sự tò mò lên đỉnh điểm.

### 3. Cảnh Bùng Nổ & Bánh Kem 3D Khổng Lồ
- **Âm nhạc:** Nhạc sinh nhật tưng bừng bùng lên.
- **Giao diện xuất hiện:** 
  - Chiếc bánh kem 3D "Super Size" rực rỡ hiện ra ở trung tâm với đĩa vàng kim, lớp kem chảy sống động, cốm màu lấm tấm, dâu tây đỏ mọng và ngọn nến họa tiết xoắn.
  - Phía trên là dòng chữ **"HAPPY BIRTHDAY THANH VY - 03.09"** cùng bạn Doraemon bay lượn bên cạnh.
  - Xung quanh rợp bóng bay lơ lửng và kim tuyến rơi.
- **Tương tác Ước Nguyện:** 
  - Dòng chữ *"Hãy nhắm mắt lại và ước một điều ước nhé... ✨"* từ từ được gõ ra.
  - Cố tình đợi thêm **3 giây** (để Thanh Vy nhắm mắt ước) rồi nút phát sáng **"Thổi Nến 🌬️"** mới bắt đầu xuất hiện.
  - Khi thổi nến: Ngọn lửa tắt, làn khói bốc lên kèm pháo hoa kim tuyến bay rợp trời.

### 4. Minigame "Đập Bóng Bay & Thu Thập Bảo Bối" (The Balloon Hunt & Wish Bag)
- **Hành động:** Sau khi thổi nến, 20 quả bóng bay rực rỡ sẽ bay lơ lửng khắp màn hình. Bảng đếm số bắt đầu nhảy số ở góc (`0/20`).
- **Tương tác 100% Thiệp Chúc:** **Tất cả các quả bóng bay đều mang theo một phong thư chứa bảo bối thần kỳ** (không còn quả bóng rỗng nào).
  - Mỗi khi chạm nổ bóng $\rightarrow$ Tiếng mở giấy xột xoạt, hiện lá thư chúc ngẫu nhiên với một món bảo bối độc nhất từ kho 35 bảo bối.
  - Khi bấm "Nhận 💌", lời chúc sẽ tự động bay vào **🎒 Túi Bảo Bối Kỷ Niệm** ở góc màn hình để xem lại bất cứ lúc nào.
  - Bộ đếm nhấp nháy cập nhật liên tục (Ví dụ: `15/20`).
  - Quả bóng thứ 20 (Boss Balloon) xuất hiện đặc biệt mang theo cuốn sổ nhỏ, đập nổ quả cuối cùng này sẽ mở ra cuốn sổ 3D hào quang.

### 5. Cú Chót - Lật Mở Cuốn Sổ Kỷ Niệm 3D (The Grand Finale)
- **Hiệu ứng đặc biệt:** Khi quả bóng **cuối cùng** (quả bóng số 12 mang cuốn sổ nhỏ) bị đập nổ tung:
  - Pháo hoa giấy bùng nổ rực rỡ (`firePremiumConfetti`).
  - Cuốn sổ kỷ niệm **văng thẳng ra giữa màn hình với hiệu ứng hào quang ánh vàng (Golden Glow)**.
  - Nhạc nền tự động hạ âm lượng êm ái (Audio Ducking).
  - Sau 800ms, cuốn sổ **tự động lật mở trang đầu tiên** đưa Thanh Vy bước vào thế giới kỷ niệm.
- **Trải nghiệm lật sách 3D đa năng:** 
  - Hỗ trợ **Vuốt cảm ứng ngón tay (Touch Swipe)** sang trái/phải trên điện thoại hoặc bấm nút chuyển trang.
  - Mỗi lần lật trang có âm thanh lật giấy và rung nhẹ.
  - **Trang 1:** Bìa sổ & Khung ảnh Polaroid rực rỡ của Thanh Vy (`image/tvy/1.jpg`).
  - **Trang 2:** Bức thư chúc mừng "Bảo Bối Tuổi Mới" & Ảnh Polaroid tỏa nắng (`image/tvy/2.jpg`).
  - **Trang 3:** Album ảnh kỷ niệm ngọt ngào (`image/tvy/3.jpg`, `image/tvy/4.jpg`, `image/tvy/5.jpg`).
  - **Trang 4:** Thông điệp "Cỗ Máy Thời Gian", chữ ký tình cảm, ảnh kỷ niệm (`image/tvy/7.jpg`) cùng nút "Đóng sổ" và "Gửi lời cảm ơn 💖".

---

## 🏁 Lưu Ý & Triển Khai
Toàn bộ hình ảnh thật của Thanh Vy trong thư mục `image/tvy/` đã được tích hợp đầy đủ và sắc nét. Bạn có thể mở trực tiếp trang web trên trình duyệt điện thoại hoặc máy tính để tận hưởng trải nghiệm trọn vẹn!
