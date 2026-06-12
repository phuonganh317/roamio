# ROAMIO - Presentation Notes

## Script 3-5 phút

Xin chào mọi người, hôm nay em trình bày ROAMIO, một ứng dụng AI hỗ trợ du lịch cá nhân hóa. Vấn đề chính là khi đi du lịch, người dùng thường bị quá tải thông tin, khó biết địa điểm nào hợp gu, hợp ngân sách, gần vị trí hiện tại, và khó tìm bạn đồng hành có phong cách tương tự.

ROAMIO giải quyết vấn đề đó bằng cách nhận hồ sơ người dùng, vị trí hiện tại, danh sách địa điểm và lịch sử check-in mẫu. Sau đó hệ thống dùng nhiều thuật toán AI đơn giản nhưng dễ giải thích để đưa ra Top 5 địa điểm phù hợp nhất và Top 5 người có thể đi cùng.

Đầu tiên, hệ thống dùng K-Means để phân nhóm người dùng. Ví dụ một người thích ăn uống và văn hóa sẽ vào nhóm Food & Culture Lover. Người thích tiết kiệm và khám phá có thể vào nhóm Budget Explorer. Nhóm này giúp hệ thống hiểu nhanh phong cách du lịch tổng quát của người dùng.

Tiếp theo, ROAMIO dùng BallTree kết hợp khoảng cách Haversine để lọc các địa điểm gần vị trí hiện tại. Haversine phù hợp vì dữ liệu là latitude và longitude, tức tọa độ trên bề mặt Trái Đất. BallTree giúp tìm nhanh các điểm gần nhất trước khi chấm điểm chi tiết.

Sau khi có danh sách ứng viên, hệ thống dùng Logistic Regression để dự đoán xác suất người dùng thích một địa điểm. Feature gồm khoảng cách, có khớp sở thích không, có hợp ngân sách không, có hợp cluster không, và rating của địa điểm.

Tiếp theo là Jaccard Similarity. Thuật toán này so sánh lịch sử check-in của các user. Nếu hai người từng đi nhiều địa điểm giống nhau, hệ thống xem họ có hành vi tương tự. Từ đó, địa điểm mà nhóm user tương tự hay đi sẽ được cộng điểm social.

Cuối cùng, hệ thống dùng Hybrid Scoring. Điểm cuối cùng bằng 50% personal score, 20% cluster score, 20% social score, và 10% distance score. Cách này giúp kết quả không chỉ gần, mà còn hợp sở thích, hợp nhóm người dùng, và có bằng chứng xã hội.

Ngoài gợi ý địa điểm, ROAMIO còn có User Matching. Phần này dùng cosine similarity để so sánh sở thích, cộng thêm độ tương đồng ngân sách và pace du lịch. Kết quả là danh sách người dùng có khả năng đi chung tốt.

Điểm mạnh của ROAMIO là luồng AI rõ ràng, dễ demo, dễ giải thích, và mỗi kết quả đều có lý do. Hạn chế hiện tại là dữ liệu vẫn là dữ liệu mẫu, Logistic Regression được train từ nhãn synthetic, chưa phải dữ liệu người dùng thật. Trong tương lai, hệ thống có thể thêm dữ liệu thật, nâng model lên LightGBM, thêm bản đồ nâng cao, lịch trình tự động, và feedback từ người dùng.

## Flow thuật toán

```text
User Profile
-> K-Means Cluster
-> BallTree + Haversine Nearby Places
-> Logistic Regression Personal Score
-> Jaccard Social Score
-> Hybrid Final Score
-> Recommendation + Explanation
```

## Vì sao dùng các thuật toán này?

- K-Means: đơn giản, trực quan, phù hợp để phân nhóm user khi chưa có nhãn thật.
- Haversine: đúng với bài toán tính khoảng cách theo tọa độ địa lý.
- BallTree: tìm địa điểm gần nhanh hơn so với duyệt toàn bộ khi dữ liệu lớn.
- Logistic Regression: dễ chạy, dễ giải thích, phù hợp bản demo recommendation.
- Jaccard Similarity: phù hợp khi so sánh tập địa điểm đã check-in.
- Hybrid Scoring: kết hợp nhiều tín hiệu để kết quả cân bằng hơn.
- Cosine Similarity: phù hợp để so sánh vector sở thích giữa hai user.

## Điểm mạnh sản phẩm

- Cá nhân hóa theo sở thích, ngân sách và vị trí.
- Có giải thích điểm số cho từng recommendation.
- Có tính năng ghép bạn đồng hành.
- Có frontend để demo và backend AI chạy được bằng terminal.

## Hạn chế hiện tại

- Dữ liệu là mock/sample data.
- Chưa có pipeline train bằng dữ liệu thật.
- Frontend mặc định vẫn có local fallback logic.
- Backend chưa có database ghi dữ liệu mới.

## Hướng phát triển

- Thu thập check-in và feedback thật.
- Nâng Logistic Regression lên LightGBM khi dữ liệu lớn hơn.
- Tích hợp frontend gọi backend cho toàn bộ luồng demo.
- Thêm bản đồ tuyến đường và tạo lịch trình tự động.
- Thêm đánh giá địa điểm từ người dùng để cải thiện model.
