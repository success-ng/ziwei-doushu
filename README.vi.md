<div align="center">

# Tử Vi Đẩu Số · Bộ máy lập lá số mã nguồn mở

### Thuật toán là trí tuệ truyền thống được công khai, không nên bị khóa sau bức tường

[![CI](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml/badge.svg)](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](./LICENSE)
[![Dataset: CC BY 4.0](https://img.shields.io/badge/dataset-CC%20BY%204.0-green.svg)](./DATASET-LICENSE)

[中文](./README.md) · [English](./README.en.md) · **Tiếng Việt**

</div>

**Một. Triết lý dự án:** Tử Vi Đẩu Số (紫微斗数) là tinh hoa của mệnh lý học truyền thống Trung Quốc. Thầy Ni Hại Hạ (倪海厦) đã hệ thống lại hệ Tử Vi Đẩu Số chính thống trong «Thiên Kỷ» (《天纪》). Chúng tôi muốn dùng công nghệ để nhiều người hơn được tiếp cận và học môn này.

Chúng tôi mở mã nguồn thuật toán lập lá số và cơ sở tri thức, vì tin rằng: **thuật toán là trí tuệ truyền thống được công khai, không nên bị khóa sau bức tường**. Giá trị thật nằm ở chiều sâu của phần luận giải, ở việc mài giũa trải nghiệm người dùng, và ở những gì tích lũy được khi vận hành lâu dài.

**Hai. Thông tin dự án:** Hệ thống lập lá số Tử Vi Đẩu Số theo hệ giảng của **Ni Hại Hạ trong «Thiên Kỷ»**, gồm thuật toán lập lá số đầy đủ, hệ tứ hóa (四化: Lộc, Quyền, Khoa, Kỵ), kho cách cục, nguyên văn cổ thư, cùng một bộ dữ liệu luận giải Tử Vi Đẩu Số mã nguồn mở trọn vẹn: **bộ dữ liệu luận giải v4.0 — 674,976 lá số × 13 chiều = 8,774,688 đoạn luận giải, phần chữ khoảng 20,4 tỷ chữ, sau khi giải nén 56,6 GB** (phát hành 2026-10-15).

| Bộ dữ liệu | Lá số | Số đoạn luận giải | Sau giải nén | Năm phủ | Số chữ luận giải mỗi lá |
|---|---|---|---|---|---|
| **v4.0 bộ dữ liệu luận giải** (2026-10-15) | **674,976** | **8,774,688** | **56.6 GB** | **1950–2026** (chỉ ngày có thật) | **khoảng 30,000 chữ** |
| v3.0 bộ dữ liệu mẫu | 518,400 | 6,739,200 | 33.1 GB | 1924–1983 | khoảng 21,000 chữ |
| Chênh | +30% | +30% | **+71%** | +17 năm | +44% |

<sub>Số chữ mỗi lá của v3.0 ước lượng trên mẫu 2,160 lá; các số còn lại là thống kê toàn bộ. Cả hai bản đều 13 chiều mỗi lá.</sub>

Trải nghiệm trên web: [ouranic.cn](https://ouranic.cn/?from=gh-readme). Lập lá số, luận giải AI và lịch sử lá số đều mở.

> **Chú thích: về việc phán lục thân**
>
> Tử Vi Đẩu Số có giới hạn nhất định khi phán lục thân (cha mẹ, anh chị em, con cái, v.v.). Trong «Thiên Kỷ», thầy Ni chỉ ra: «斗数批六亲本来就比较差一点» — Đẩu Số phê lục thân vốn đã kém hơn một chút ([2 thượng · 00:25:27](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=1527)). Trong các môn thuật số truyền thống, Thiết Bản Thần Số có sở trường riêng khi đối chiếu lục thân ([2 thượng · 00:03:15](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=195)); thầy Ni vẫn lấy Tử Vi Đẩu Số làm trục, vì môn này kết hợp được địa lý, hoàn cảnh và việc người, thành một hệ trọn vẹn «trên biết thiên văn, dưới biết địa lý, giữa biết nhân sự» ([2 thượng · 00:25:43](https://www.bilibili.com/video/BV1KJsLekEfA?p=3&t=1543)). Vì vậy, phần phân tích liên quan đến lục thân chỉ để tham khảo; trên [ouranic.cn](https://ouranic.cn/?from=gh-readme), ba chiều phụ mẫu, huynh đệ và tử nữ cũng kèm chú thích này.

---

## Mục lục

| | Chương | Một câu |
|---|------|--------|
| Một | [Cập nhật lần này](#một-cập-nhật-lần-này-2026-10-15) | Hiệu đính từng câu lời luận 13 chiều theo nguyên văn thầy Ni và «Toàn thư», phát hành bộ dữ liệu luận giải v4.0: 67,5 vạn lá số × 13 chiều |
| Hai (mới) | [Bộ dữ liệu luận giải 13 chiều v4.0](#hai-mới-bộ-dữ-liệu-luận-giải-13-chiều-v40-2026-10-15) | Lời luận bản 2026-10-15, 67,5 vạn lá số, tải theo năm |
| Hai | [Bộ dữ liệu mẫu 518,400 lá số](#hai-bộ-dữ-liệu-mẫu-518400-lá-số) | Quy cách, cách tải, công dụng, giấy phép |
| Ba | [Bắt đầu nhanh](#ba-bắt-đầu-nhanh) | Từ lúc clone đến lúc chạy được |
| Bốn | [Bộ máy lập lá số](#bốn-bộ-máy-lập-lá-số) | Làm được gì, tệp chia thế nào, dữ liệu cổ thư |
| Năm | [Nguyên văn thầy Ni trong «Thiên Kỷ», phần Tử Vi Đẩu Số](#năm-nguyên-văn-thầy-ni-trong-thiên-kỷ-phần-tử-vi-đẩu-số) | 14 bài + 2 đoạn bổ sung, 1848 câu, một hình xem hết, mỗi câu nghe lại được |
| Sáu | [Giao diện là một bản Demo](#sáu-giao-diện-là-một-bản-demo) | Không phải giao diện trên web, khoảng cách ghi rõ |
| Bảy | [Ranh giới mã nguồn mở](#bảy-ranh-giới-mã-nguồn-mở-những-gì-không-có-bên-trong) | Cái gì mở, cái gì không mở |
| Tám | [Nhịp bảo trì và đóng góp](#tám-nhịp-bảo-trì-và-đóng-góp) | Nhịp đồng bộ, cách nhận issue / PR |
| Chín | [Giấy phép](#chín-giấy-phép) | Mã MIT / dữ liệu CC BY 4.0 / cổ thư công cộng / nguyên văn thầy Ni không dùng thương mại |
| Mười | [Giới thiệu và liên hệ](#mười-giới-thiệu-và-liên-hệ) | Triết lý, công nghệ, cách liên hệ |

---

## Một. Cập nhật lần này (2026-10-15)

Vòng này đi theo bản web phát hành ngày 2026-10-15 (phiên bản nội dung web `ca268829f7a9`):

![Tổng quan cập nhật lần này](./docs/update-20261015.png)

**1. Phát hành bộ dữ liệu luận giải 13 chiều v4.0** — 674,976 lá số (mỗi ngày dương lịch có thật trong các năm 1950–2026 × 12 giờ địa chi (时辰) × nam/nữ) × 13 chiều = **8,774,688 đoạn luận giải**, phần chữ khoảng 20,4 tỷ chữ. Sau giải nén 56.6 GB (v3.0 là 33.1 GB, tăng 71%), sau nén chỉ 161 MB, chia theo năm thành 77 tệp. Có thể chỉ tải những năm cần, hoặc tải một lần gói cả các năm. Tải tại [Release v4.0-13d](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d); quy cách và trường xem [mục Hai (mới)](#hai-mới-bộ-dữ-liệu-luận-giải-13-chiều-v40-2026-10-15). Trước khi phát hành, 77 tệp được giải nén từng tệp và đối từng byte với dữ liệu gốc, khớp hoàn toàn.

**2. Lời luận 13 chiều được hiệu đính từng câu theo nguyên văn thầy Ni và nguyên văn «Toàn thư»** (kho lời luận vẫn không mở mã nguồn; kết quả hiệu đính nằm trong bộ dữ liệu v4.0):

- Trích dẫn ghi là thầy Ni hoặc «Toàn thư» mà không tra được xuất xứ thì xóa, hoặc đổi thành nguyên văn tra được từng chữ. Nguyên văn thầy Ni ghi rõ tập mấy của «Thiên Kỷ», phút nào giây nào
- Câu nói về tứ hóa không thể xảy ra (như Thất Sát hóa Quyền, Tử Vi hóa Kỵ) thì xóa. Lời luận chỉ đúng khi có điều kiện thì bổ sung điều kiện đó
- Câu nói hai đầu kiểu «khi lực mạnh… khi hãm địa…» được đổi thành chỉ hiện đúng một vế khớp với lá số
- Sức khỏe: tạng phủ cần lưu ý nay theo cách thầy Ni — cung mà sát tinh tập trung nhiều nhất trên toàn lá, lấy địa chi của cung đó để ứng tạng phủ; không còn suy tạng từ ngũ hành của sao
- Mục «dẫn cổ thư» trong kho tri thức trên web tăng từ 244 chỗ lên 405 chỗ; mỗi chỗ đều tìm được từng chữ trong nguyên văn «Tử Vi Đẩu Số Toàn Thư»

**3. Đồng bộ bộ máy lập lá số** ([PR #39](https://github.com/Renhuai123/ziwei-doushu/pull/39)) — `dst-cn.ts` thêm `chinaDSTSpan(year)`, tra ngày bắt đầu và kết thúc giờ mùa hè Trung Quốc (夏令时) của một năm. `cities.ts` bổ sung kinh độ của các đơn vị cấp huyện trực thuộc tỉnh và các thành phố của Binh đoàn Tân Cương (Thần Nông Giá, các thành phố và huyện Hải Nam, Alar, v.v.). Chọn những nơi này làm nơi sinh thì hiệu chỉnh giờ mặt trời thực dùng được.

**4. Giấy phép** — Phạm vi của [`DATASET-LICENSE`](./DATASET-LICENSE) cộng thêm v4.0. Nguyên văn thầy Ni được trích trong phần luận giải không nằm trong phạm vi cấp phép của dữ liệu, thống nhất với CC BY-NC-SA 4.0 của nguyên văn thầy Ni ở chương Năm. Bộ dữ liệu mẫu v3.0 và điều khoản của bản đó giữ nguyên.

> **Bổ sung 2026-11-02:** Việc đổi ngày của giờ Tý muộn (晚子时, 23:00–23:59) nay xét theo **giờ mặt trời thực** (真太阳时), cùng một chuẩn với chi của giờ địa chi (#63). Khi đã điền nơi sinh, 23:30 trên đồng hồ tại đông kinh 100° (giờ mặt trời thực 22:10, giờ Hợi) ở lại ngày này, không còn lập thành «giờ Hợi của ngày hôm sau». Không điền nơi sinh thì không hiệu chỉnh, kết quả không đổi; ouranic.cn cũng dùng chuẩn này. Tham số gán tháng nhuận (闰月) viết sai thì báo lỗi ngay, không còn âm thầm lập lá theo «tính về tháng này» (#71). Cảm ơn Bortlesboat và xunguangzlj-cloud đã gửi, Verchiel666 đã rà lại.

> **Bổ sung 2026-10-31:** Nền tảng trực tuyến đổi tên thành **OURANIC**, địa chỉ chuyển từ metisziwei.com sang **[ouranic.cn](https://ouranic.cn/?from=gh-readme)** (chủ thể vận hành là 北京王多鱼科技有限责任公司, số ICP 京ICP备2026069066号-1). Địa chỉ cũ tự chuyển hướng. Mã nguồn, bộ dữ liệu và giấy phép của kho này đều không đổi.

> **Bổ sung 2026-10-27:** Đồng bộ bộ máy lập lá số. `true-solar-time.ts` hỗ trợ nơi sinh ngoài Trung Quốc: truyền `utcOffsetMinutes` (độ lệch chuẩn cố định của múi giờ nơi sinh), sửa kinh độ theo kinh tuyến giữa của múi giờ đó; không truyền (trường hợp trong nước) thì kết quả không đổi từng vị trí. Thêm `clock-adjust.ts`, đổi số đọc trên đồng hồ khi đang giờ mùa hè, hoặc khi múi giờ năm đó khác múi giờ hiện nay, sang giờ chuẩn (không tự vượt nửa đêm, để người dùng quyết). Nên làm thành nút người dùng tự bấm và có thể hoàn tác, đừng tự sửa. Sửa luôn một chỗ: bộ máy giờ mùa hè Trung Quốc **chỉ nhận diện, không bao giờ tự trừ**. Trước đây bảng «năng lực bộ máy» viết «tự trừ», viết sai.

> **Bổ sung 2026-10-24:** Triết lý dự án chuyển lên đầu trang. Dưới tiêu đề, một câu căn giữa: «Thuật toán là trí tuệ truyền thống được công khai, không nên bị khóa sau bức tường», ngay sau là hai đoạn nguyên văn triết lý (đánh dấu «Triết lý dự án»). Đoạn giới thiệu sẵn có được đánh dấu «Thông tin dự án». Mục «Triết lý dự án» ở chương Mười đổi thành trỏ về đầu trang.

> **Bổ sung 2026-10-20:** Độ sáng sao mặc định đổi sang «Đẩu Số Toàn Thư» (《斗数全书》), cùng mặc định với phần lớn phần mềm lập lá số. «Hiệu chỉnh hiện đại v2», vốn là mặc định trước đây, vẫn chọn được trong thiết lập lưu phái. Bổ sung độ sáng cho Thiên Diêu, Thiên Hình, Thiên Hỷ, Đại Hao, Giải Thần, Triệt Không, Phó Triệt và Tuần Không. Nguyệt Đức không còn gắn độ sáng. Đối từng cung trên 5 lá chuẩn vàng: sao vào cung và độ sáng đều khớp. Lưu ý: bộ dữ liệu v4.0 (10-15) được sinh theo mặc định cũ «hiệu chỉnh hiện đại v2», nên chữ độ sáng và một số câu luận đổi theo độ sáng sẽ khác mặc định mới.

> **Bổ sung 2026-10-06 ~ 10-07:** README thêm «Chú thích: về việc phán lục thân» (nguyên văn thầy Ni + liên kết xuất xứ, hai bản Trung và Anh). Liên kết web thêm mã kênh `?from=`. Đồng bộ đính chính ngữ liệu nguyên văn thầy Ni (chính tinh thuộc Nam Đẩu hay Bắc Đẩu).

### Cập nhật vòng trước (2026-09-21)

> **Bổ sung 2026-10-03:** 1848 câu nguyên văn của thầy Ni trong «Thiên Kỷ · Tử Vi Đẩu Số» tách thành chương riêng (chương Năm). Gộp đóng góp bên ngoài #29 (kiểm tra số thứ tự giờ địa chi). Bộ máy từ chối ngày dương lịch không tồn tại. Tài liệu bộ dữ liệu bổ sung quy ước trường và lỗi đã biết. Đưa `package-lock.json` vào kho. Địa chỉ site đổi thành cấu hình được. Bản demo hợp bàn lập lá bằng bộ máy tại chỗ; khi thiếu giao diện AI thì báo rõ. Bổ sung hướng dẫn đóng góp, quy tắc ứng xử, mẫu issue và mẫu PR. Thêm bản giới thiệu tiếng Anh [README.en.md](./README.en.md). Bỏ hai gói triển khai không dùng tới (vercel CLI, @cloudflare/next-on-pages); dependency giảm từ 483 xuống 185. Sau đó nâng lên Next.js 16 để vá lỗ hổng postcss; cảnh báo bảo mật trên GitHub từ 51 mục về 0.

![Tổng quan cập nhật lần này](./docs/update-20260921.png)

Sau ba tháng, kho này hoàn thành một lần cập nhật trọn vẹn ([PR #28](https://github.com/Renhuai123/ziwei-doushu/pull/28), 26 tệp, +2736 / −108 dòng):

**1. Bộ máy lập lá số đồng bộ về chuẩn đang chạy trên web** — `algorithm.ts` từ 181 dòng lên 641 dòng; đồng thời cập nhật sihua / types / constants / patterns / cities / famous. Thêm 8 mô-đun (1367 dòng):

| Mô-đun | Việc làm |
|------|------|
| `true-solar-time.ts` | Hiệu chỉnh giờ mặt trời thực (chênh kinh độ + quân thời sai, 均时差) |
| `dst-cn.ts` | Giờ mùa hè Trung Quốc 1986–1991 |
| `clock-adjust.ts` | Đổi số đọc trên đồng hồ sang giờ chuẩn (giờ mùa hè / múi giờ năm đó khác hiện nay) |
| `lunar-solar.ts` | Đổi âm lịch / dương lịch, và kẹp biên tháng nhuận (clamp) |
| `school-data.ts` / `school-tables.generated.ts` / `school-config.ts` | Dữ liệu và bảng đối chiếu độ sáng sao theo lưu phái; cấu hình chuẩn tháng nhuận và giờ Tý muộn |
| `shier-shen.ts` | Thập nhị thần sát |
| `yunxian-context.ts` | Ngữ cảnh vận hạn (gồm đồng hạn) |

**2. Bổ sung kiểm thử hồi quy và CI** — Trước đó kho này không có kiểm thử. Nay có 5 ca hồi quy lập lá số; một lệnh `npm test` chạy hết. Mỗi lần push và mỗi PR đều tự chạy trên GitHub Actions.

**3. Sửa chú thích giờ của mẫu bị lệch** ([#26](https://github.com/Renhuai123/ziwei-doushu/issues/26)) — Trong 11 mẫu người nổi tiếng ở `famous.ts`, 7 mẫu có chú thích giờ không khớp chỉ số `hour` (`hour` luôn là **chỉ số địa chi của giờ, 0–11**, không phải giờ đồng hồ 0–23). Đã sửa và chốt bằng một ca hồi quy.

**4. Issue tồn đọng từ 18 mục xuống còn 4 mục.** Những mục còn lại đều đang được xử lý.

**5. Tài liệu và giấy phép** — Thêm [`DATASET-LICENSE`](./DATASET-LICENSE). README bổ sung danh sách năng lực của bộ máy, nhịp bảo trì và ranh giới mã nguồn mở. Sửa hai chỗ mô tả không đúng sự thật (bộ dữ liệu «chuẩn hoàn toàn giống bản trên web», giao diện «frontend Next.js 15 đầy đủ»).

---

## Hai (mới). Bộ dữ liệu luận giải 13 chiều v4.0 (2026-10-15)

> **Nơi tải: cột Releases bên phải kho này, [Releases → v4.0-13d](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d)**

v4.0 được sinh lại bằng kho lời luận của web bản 2026-10-15. Lời luận của 13 chiều phân tích đã được hiệu đính từng câu theo bản ghi nguyên văn «Thiên Kỷ» của Ni Hại Hạ và nguyên văn «Tử Vi Đẩu Số Toàn Thư»: trích dẫn không tra được xuất xứ thì xóa hoặc đổi thành nguyên văn tra được từng chữ (nguyên văn thầy Ni ghi số tập «Thiên Kỷ» và mã thời gian); câu nói về tứ hóa không thể xảy ra thì xóa; lời luận có điều kiện thì viết rõ điều kiện.

### Quy cách

| Mục | Nội dung |
|------|------|
| Số lá số | **674,976 lá** (dương lịch 1950–2026 × số ngày thật của mỗi tháng × 12 giờ địa chi × nam/nữ) |
| Số đoạn luận giải | **8,774,688 đoạn** (mỗi lá 13 chiều) |
| Các chiều | Tổng quan mệnh cách, tính cách, tình cảm, sự nghiệp, tài vận, sức khỏe, huynh đệ, tử nữ, thiên di, quan hệ, điền trạch, phúc đức, phụ mẫu |
| Dung lượng | Sau giải nén 56.6 GB; sau nén 161 MB (77 tệp theo năm, zstd; thêm một gói cả các năm `ziwei-interp-v4-all.tar`) |
| Phần chữ | Khoảng 20,4 tỷ chữ; mỗi lá khoảng 30,000 chữ |
| Cách sinh | Bộ máy lập lá số + kho lời luận, sinh tất định, không qua AI; cùng đầu vào thì luôn cùng đầu ra |
| Phiên bản nội dung | `ca268829f7a9` (ANALYSIS_CONTENT_VERSION cùng kỳ với web) |

**Mỗi dòng một lá** (JSON Lines). Các trường:

| Trường | Nghĩa |
|------|------|
| `k` | Khóa: `YYYY-MM-DD-số giờ địa chi-giới`, ví dụ `1990-01-01-0-male` |
| `y` / `m` / `d` | Ngày sinh **dương lịch**; chỉ gồm ngày có thật (không còn kiểu 30 tháng 2) |
| `h` | **Số thứ tự giờ địa chi 0–11** (Tý = 0 …… Hợi = 11), không phải giờ đồng hồ. Bảng đối chiếu ở [mục Hai](#hai-bộ-dữ-liệu-mẫu-518400-lá-số) |
| `g` | `male` / `female` |
| `ms` | Chính tinh đầu tiên của cung Mệnh (命宫); cung Mệnh không có chính tinh thì là `null` |
| `t` | Số chữ từng chiều |
| `c` | Toàn văn luận giải 13 chiều (Markdown). Khóa: `overview` / `personality` / `love` / `career` / `wealth` / `health` / `family` / `children` / `move` / `friends` / `home` / `spirit` / `parents` |

**Chuẩn nội dung**

- Đây là luận giải ở góc lá bản mệnh. Những câu web viết lại theo tuổi người đọc hiện tại, đoạn phép tắc của thầy Ni gắn thêm ở cuối mỗi chiều, và luận giải AI đều không có trong bộ dữ liệu.
- Lập lá thẳng từ số thứ tự giờ địa chi, không hiệu chỉnh giờ mặt trời thực theo nơi sinh.

### Tải và giải nén

```bash
# Tải một lần cả bộ: gh release download v4.0-13d --repo Renhuai123/ziwei-doushu -p "ziwei-interp-v4-all.tar"
# Chỉ cần vài năm thì chỉ tải những năm đó, ví dụ năm 1990
zstd -d --long=27 year-1990.jsonl.zst          # ra year-1990.jsonl
shasum -a 256 -c SHA256SUMS.txt --ignore-missing # kiểm checksum
```

Phải có `--long=27` (lúc nén đã dùng cửa sổ dài). Trên Windows có thể dùng zstd.exe trong [gói phát hành chính thức của zstd](https://github.com/facebook/zstd/releases), tham số giống vậy.

### Về trích dẫn

Nguyên văn «Thiên Kỷ» của Ni Hại Hạ được trích trong phần luận giải **không thuộc phạm vi cấp phép của bộ dữ liệu này**. Đó là những trích dẫn ngắn, ghi số tập và mã thời gian để chỉ xuất xứ của lời luận; quyền tác giả thuộc chủ thể quyền gốc. Muốn dùng riêng các nguyên văn đó theo lô thì xử lý theo [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md) của nguyên văn thầy Ni ở chương Năm. Nguyên văn «Tử Vi Đẩu Số Toàn Thư» thuộc phạm vi công cộng.

### Giấy phép

Giống v3.0: **CC BY 4.0, được dùng thương mại tự do; yêu cầu duy nhất là giữ ghi nguồn** (trừ nguyên văn thầy Ni nói ở «Về trích dẫn» phía trên). Điều khoản đầy đủ xem [DATASET-LICENSE](./DATASET-LICENSE). Khi trích dẫn, xin ghi:

> Dự án này dùng **Bộ dữ liệu luận giải Tử Vi Đẩu Số mã nguồn mở v4.0** (674,976 lá số × 13 chiều)
> Nguồn: https://github.com/Renhuai123/ziwei-doushu
> Tác giả: 王多鱼AI

---

## Hai. Bộ dữ liệu mẫu 518,400 lá số

> **Nơi tải: trang [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) ở cột bên phải kho này**

Chúng tôi mở mã nguồn một bộ dữ liệu mẫu lá số Tử Vi Đẩu Số trọn vẹn, phủ **518,400 cách lập lá** (năm 60 × tháng 12 × ngày 30 × giờ 12 × giới 2). Mỗi mẫu gồm cấu trúc lá số đầy đủ và văn bản luận giải theo hệ Ni Hại Hạ.

### 2.1 Quy cách dữ liệu

| Mục | Nội dung |
|------|------|
| Số mẫu | **518,400 mẫu** |
| Dung lượng | Sau nén 5.5 GB (chia 3 phần), sau giải nén 33.1 GB |
| Hệ | Chính thống theo «Thiên Kỷ» của Ni Hại Hạ (phái phi tinh thuần túy đã ngừng) |
| Nội dung | JSON lá số + văn bản luận giải 13 chủ đề (tổng quan mệnh cách, tài vận, sự nghiệp, tình cảm, sức khỏe, v.v.) |
| Kiểm chứng | Lá nam và lá nữ khác nhau 100%; sức khỏe có Tý Ngọ lưu chú 100%; lá nữ có phần chăm sóc phụ khoa 100% |
| Chuẩn | Sinh bởi **bộ máy lập lá số bản v3 + kho lời luận cùng kỳ**. Bộ máy trên web vẫn cập nhật, nên đầu ra bản mới có thể khác bộ dữ liệu này |

**Quy ước trường** (mỗi mẫu sinh từ `birthInfo`; chỗ hay bị đọc nhầm là `hour`):

| Trường | Nghĩa |
|------|------|
| `birthInfo.year` / `month` / `day` | Ngày sinh **dương lịch**: các năm 1924–1983 (một giáp trọn), mỗi tháng lấy ngày 1–30 |
| `birthInfo.hour` | **Số thứ tự giờ địa chi 0–11**, không phải giờ đồng hồ 0–23: Tý = 0, Sửu = 1 …… Hợi = 11 |
| `birthInfo.gender` | `male` / `female` |
| `birthInfo.longitude` | Cố định 120 (đông kinh 120°, không hiệu chỉnh giờ mặt trời thực theo từng nơi) |
| Tên tệp `YYYY-MM-DD-hHH-giới.json` | `hHH` cũng là số thứ tự giờ địa chi. Ví dụ `h11` là giờ Hợi, không phải 11 giờ sáng |

Đối chiếu số thứ tự giờ địa chi với giờ đồng hồ:

| Số | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Giờ địa chi | Tý 子 | Sửu 丑 | Dần 寅 | Mão 卯 | Thìn 辰 | Tỵ 巳 | Ngọ 午 | Mùi 未 | Thân 申 | Dậu 酉 | Tuất 戌 | Hợi 亥 |
| Giờ đồng hồ | 23–1 | 1–3 | 3–5 | 5–7 | 7–9 | 9–11 | 11–13 | 13–15 | 15–17 | 17–19 | 19–21 | 21–23 |

Sinh từ 23:00–23:59 (giờ Tý muộn) thì lập lá theo ngày hôm sau, giờ lấy 0. Sinh từ 00:00–00:59 (giờ Tý sớm) thì lập lá theo ngày đó, giờ cũng lấy 0.

**Lỗi đã biết: khoảng 2,520 mẫu có ngày không tồn tại.** Lúc sinh dữ liệu, mỗi tháng đều lấy ngày 1–30, nên ngày 30 tháng 2, và ngày 29 tháng 2 của năm không nhuận, cũng được sinh mẫu. Cộng 105 ngày × 12 giờ địa chi × 2 giới = 2,520 mẫu, chiếm 0.49%. Bộ máy v3 gặp những ngày này không báo lỗi, mà dồn thành ngày 1–2 tháng 3 rồi lập lá, nên nội dung các mẫu đó trùng với mẫu ngày 1–2 tháng 3 tương ứng. Khi dùng, hãy lọc bỏ: `month = 2` và `day = 30`, hoặc `month = 2` và `day = 29` khi năm đó không nhuận. Từ 2026-10-03, bộ máy từ chối thẳng ngày không tồn tại; bộ dữ liệu bản sau sẽ không còn những mẫu này.

### 2.2 Cách tải

Vào [Releases](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples) và tải các tệp sau:

```
ziwei-samples-v3-part1.zip.001  (1.9 GB)
ziwei-samples-v3-part2.zip.002  (1.9 GB)
ziwei-samples-v3-part3.zip.003  (1.8 GB)
SHA256SUMS.txt                  (tệp kiểm tra)
```

Tải xong thì nối và giải nén:

```bash
# macOS / Linux
cat ziwei-samples-v3-part*.zip.* > combined.zip
unzip combined.zip

# Windows (PowerShell)
Get-Content ziwei-samples-v3-part*.zip.* -Encoding Byte -ReadCount 0 | Set-Content combined.zip -Encoding Byte
Expand-Archive combined.zip
```

### 2.3 Công dụng

- Ngữ liệu tinh chỉnh mô hình nhỏ (518,400 cặp đầu vào–đầu ra)
- Nguồn truy xuất RAG cho hội thoại AI
- Đường cơ sở để so A/B sau khi sửa `patterns.ts`
- Nghiên cứu và phân tích dữ liệu Tử Vi Đẩu Số

### 2.4 Giấy phép dữ liệu và cách trích dẫn

📂 **Mở hoàn toàn · được dùng thương mại tự do** — bạn có thể dùng bộ dữ liệu này trong bất kỳ dự án nào, gồm:

- Sản phẩm thương mại / SaaS / ứng dụng trả phí
- Tinh chỉnh mô hình AI (mô hình mở hay đóng đều được)
- Phát triển tiếp, phân phối lại, bộ dữ liệu phái sinh
- Nghiên cứu học thuật, blog kỹ thuật, khóa dạy

Không phải trả phí, không phải xin phép, không phải báo trước.

**Yêu cầu duy nhất là giữ ghi nguồn (attribution):**

> Dự án này dùng **Bộ dữ liệu mẫu Tử Vi Đẩu Số mã nguồn mở v3.0** (518,400 mẫu)
> Nguồn: https://github.com/Renhuai123/ziwei-doushu
> Tác giả: 王多鱼AI

Đặt ở đâu cũng được:

- **Web / sản phẩm:** trang About / Giới thiệu / Nguồn dữ liệu / chân trang, một dòng liên kết là đủ
- **Mô hình AI:** trường "Training Data" của model card hoặc dataset card
- **Bài báo:** mục tài liệu tham khảo hoặc lời cảm ơn
- **Bộ dữ liệu phát hành lại:** ghi nguồn thượng nguồn trong README hoặc tệp metadata

Chỉ một điều đó, còn lại đều tự do. Điều khoản đầy đủ xem [DATASET-LICENSE](./DATASET-LICENSE). Mong bộ dữ liệu này giúp bạn làm ra thứ đáng giá. Làm xong nhớ ghé 小红书 / 抖音 / 闲鱼 chào **@王多鱼AI** một tiếng 👋

---

## Ba. Bắt đầu nhanh

```bash
# Clone
git clone https://github.com/Renhuai123/ziwei-doushu.git
cd ziwei-doushu

# Cài dependency
npm install

# Biến môi trường (chỉ xem lá số thì bỏ qua; cấu hình AI chỉ cần khi bạn tự làm các route /api/*)
cp .env.example .env.local

# Chạy máy chủ dev
npm run dev
```

Kiểm tra tại chỗ:

```bash
npm run typecheck   # kiểm tra kiểu TypeScript toàn bộ
npm test            # hồi quy bộ máy lập lá số (768 lá × thiết luật Tử Vi, giờ mùa hè, biên Lập Xuân, Hồng Loan Thiên Hỷ, giờ mẫu nhất quán, biên số thứ tự giờ, ngày hợp lệ, song tứ hóa đồng cung)
```

Mỗi lần push và mỗi PR đều chạy cùng bộ này trên GitHub Actions (xem [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)).

> **Lưu ý: bản mã nguồn mở không có route API phía máy chủ.** Lập lá số, hiển thị lá và lập lá hợp bàn đều chạy trong trình duyệt bằng bộ máy của kho này, **không cần API Key**. Luận giải AI (`/api/interpret`) và phân tích AI hợp bàn (`/api/heming`) phải do bạn tự viết API. Chưa viết thì hai chỗ đó báo thẳng «bản mã nguồn mở không có API này»; cấu hình API Key cũng không làm chúng chạy được (#30 chính là chuyện này).

---

## Bốn. Bộ máy lập lá số

Nhân lập lá số nằm hết trong `lib/ziwei/`.

### 4.1 Làm được những gì (khác các thư viện lập lá số thường gặp)

| Năng lực | Nội dung |
|------|------|
| **Hiệu chỉnh giờ mặt trời thực** | Tính chênh giờ theo kinh độ nơi sinh + quân thời sai, tránh lệch một giờ địa chi giữa phía đông và phía tây |
| **Giờ mùa hè Trung Quốc** | Tự nhận khoảng giờ mùa hè các năm 1986–1991 (chỉ nhận, không tự trừ; sau khi người dùng xác nhận, dùng `clock-adjust.ts` đổi số đọc trên đồng hồ sang giờ chuẩn) |
| **Bốn chuẩn tháng nhuận** | Tháng nhuận tính về tháng trước / tháng sau / cắt theo ngày / tính về tháng này; cấu hình được, không khóa chết một phái |
| **Đổi ngày giờ Tý muộn** | 23:00–23:59 lập theo ngày hôm sau, 00:00–00:59 lập theo ngày đó; khi đã điền nơi sinh thì xét theo giờ mặt trời thực (cùng chuẩn với giờ địa chi); chiến lược đổi ngày chuyển được |
| **Độ sáng sao 7 mức** | Miếu / Vượng / Đắc / Lợi / Bình / Bất / Hãm; thêm 3 mức thô để hạ cấp khi hiển thị |
| **Đổi được lưu phái độ sáng** | Các lưu phái (kể cả các phiên bản khác nhau của phần mềm lập lá số phổ biến) phán độ sáng phụ tinh không giống nhau; làm thành công tắc, không viết chết |
| **Tứ hóa và phi tinh** | Tứ hóa năm sinh, tứ hóa đại hạn / lưu niên, phi tinh tự hóa |
| **Thập nhị thần sát** | Tầng bản mệnh khởi theo địa chi năm sinh; tầng lưu niên đổi sang khởi theo địa chi lưu niên |
| **Phán cách cục** | Kho luật 1100+ dòng (Tử Phủ đồng cung, Nhật Nguyệt tịnh minh, Thất Sát triều Đẩu, v.v.) |

### 4.2 Các tệp được chia thế nào

| Tệp | Nội dung |
|------|------|
| `algorithm.ts` | Quy trình lập lá số đầy đủ: an cung Mệnh, định cục ngũ hành, an mười bốn chính tinh, an phụ tinh, xếp đại hạn và lưu niên |
| `constants.ts` | Hằng số thiên can, địa chi, mười bốn chính tinh, phụ tinh |
| `sihua.ts` | Hệ tứ hóa phi tinh (Lộc, Quyền, Khoa, Kỵ), kèm bảng tứ hóa từng thiên can |
| `patterns.ts` | **Kho cách cục 1100+ dòng:** luật phán các cách cổ điển như Tử Phủ đồng cung, Nhật Nguyệt tịnh minh, Thất Sát triều Đẩu |
| `heming-knowledge.ts` | Phương pháp hợp bàn: logic so hai lá trong hệ thầy Ni |
| `types.ts` | Định nghĩa kiểu TypeScript |
| `cities.ts` | Kinh độ và vĩ độ các thành phố Trung Quốc, dùng để hiệu chỉnh giờ mặt trời thực |
| `famous.ts` | Dữ liệu lá số mẫu của nhân vật lịch sử |
| `school-data.ts` / `school-tables.generated.ts` / `school-config.ts` | Dữ liệu và bảng đối chiếu độ sáng sao theo lưu phái; cấu hình chuẩn tháng nhuận và giờ Tý muộn |
| `shier-shen.ts` | Thập nhị thần sát (bản mệnh khởi theo địa chi năm sinh, tầng lưu niên khởi theo địa chi lưu niên) |
| `true-solar-time.ts` | Hiệu chỉnh giờ mặt trời thực (chênh kinh độ + quân thời sai) |
| `dst-cn.ts` | Năm và khoảng giờ mùa hè Trung Quốc 1986–1991 |
| `clock-adjust.ts` | Dịch số đọc trên đồng hồ theo phút thành giờ chuẩn (không tự vượt nửa đêm) |
| `yunxian-context.ts` | Ngữ cảnh vận hạn (gồm xử lý đồng hạn) |
| `lunar-solar.ts` | Đổi âm lịch / dương lịch, và kẹp biên tháng nhuận (clamp) |

### 4.3 Nguyên văn cổ thư (`lib/classics/`)

- **Cốt Tủy Phú** (`gusuifu.ts`) — ca quyết cốt lõi của Tử Vi Đẩu Số
- **Tử Vi Đẩu Số Toàn Tập** (`quanji.ts`) — bản cổ đời Thanh
- **Tử Vi Đẩu Số Toàn Thư** (`quanshu.ts`) — bản truyền của Trần Hy Di

### 4.4 Đồ thị tri thức SEO (`lib/seo/`)

Dữ liệu tri thức có cấu trúc cho 14 chính tinh × 12 cung, dùng để sinh nội dung hoặc dựng kho tri thức.

---

## Năm. Nguyên văn thầy Ni trong «Thiên Kỷ», phần Tử Vi Đẩu Số

![Một hình xem hết «Thiên Kỷ · Tử Vi Đẩu Số» của Ni Hại Hạ](./docs/tianji-ziwei/overview.png)

Phần Tử Vi Đẩu Số trong «Thiên Kỷ» của Ni Hại Hạ có **1848 câu** nguyên văn: 14 bài chính (bài 2 đến bài 15, phần thượng) cộng 2 đoạn bổ sung, chia theo bài thành 16 tệp, đặt tại [`docs/tianji-ziwei/`](./docs/tianji-ziwei/). Mỗi câu có mốc thời gian xuất xứ; bấm một cái là nhảy về đúng giây đó trên video gốc ở Bilibili.

- **Cách đọc:** tìm chủ đề trên hình phía trên, rồi mở đúng bài đó. Ví dụ [5 thượng](./docs/tianji-ziwei/5%E4%B8%8A.md) (Tử Vi tại Tý), [13 thượng](./docs/tianji-ziwei/13%E4%B8%8A.md) (Sát Phá Lang, tam hội Khoa Quyền Lộc).
- **Lấy từ đâu:** lấy từ kho chị em [nihai-tianji-corpus](https://github.com/Renhuai123/nihai-tianji-corpus). Lấy ngữ liệu làm chuẩn, và sẽ đồng bộ theo ngữ liệu.
- **Dùng thương mại được không:** **Không.** Nội dung chương này dùng riêng CC BY-NC-SA 4.0. Xem [Chín. Giấy phép](#chín-giấy-phép).

---

## Sáu. Giao diện là một bản Demo

Mã giao diện nằm trong `app/` và `components/`. Giao diện trong kho là **một ví dụ nhỏ chạy được**, để chạy bộ máy lập lá số và vẽ lá ra, tiện cho bạn làm sản phẩm của mình trên nền đó. **Giao diện bản thương mại trên web không nằm trong phạm vi mã nguồn mở.** Hai bên cách nhau rất xa:

| Trang / thành phần | Kho này (Demo) | Bản thương mại trên web |
|------|------|------|
| Trang lập lá `app/chart/page.tsx` | 75 dòng | 1227 dòng |
| Bảng luận giải `InsightPanel` | 467 dòng | 5088 dòng |
| Ô lá số `ChartBoard` | 285 dòng | 1334 dòng |
| Ô cung `PalaceCell` | 201 dòng | 1192 dòng |
| Trang hợp bàn `app/heming/page.tsx` | 368 dòng | 1937 dòng |

**Demo chạy được:** biểu mẫu thông tin sinh, ô lá số và chi tiết từng cung, chuyển bản mệnh / đại hạn / lưu niên, trình đọc cổ thư (tìm toàn văn), bách khoa mệnh lý (14 chính tinh × 12 cung), giao diện sáng/tối, tương thích di động.

**Demo không có:** giao diện tương tác đã làm lại trên bản thương mại, luận giải AI dạng stream, đồ thị hợp bàn, thẻ chia sẻ, và **chính nội dung lời luận** (`db-analysis.ts` là bản giữ chỗ). Nói cách khác, Demo vẽ được lá, nhưng không đưa ra bộ luận giải đang chạy trên web.

---

## Bảy. Ranh giới mã nguồn mở: những gì không có bên trong

| | Nội dung |
|---|---|
| ✅ **Mở mã nguồn** | Bộ máy lập lá số (`lib/ziwei/`), nguyên văn cổ thư thuộc phạm vi công cộng (`lib/classics/`), đồ thị tri thức SEO (`lib/seo/`), giao diện Demo, bộ dữ liệu mẫu 518,400 lá, bộ dữ liệu luận giải 13 chiều v4.0 |
| ❌ **Không mở mã nguồn** | Kho lời luận (`lib/ziwei/db-analysis.ts` là bản giữ chỗ; bản trên web là hơn một vạn dòng lời luận của 13 chủ đề), prompt luận giải AI, API phía máy chủ (`/api/interpret` và các route khác), hệ thống người dùng (đăng nhập / hội viên / thanh toán), an ninh phía máy chủ (chữ ký, chống lạm dụng, thủy ấn), cấu hình triển khai |

Nếu bạn cần khả năng luận giải bằng AI, có thể dựa vào kho tri thức trong `lib/ziwei/patterns.ts` và `heming-knowledge.ts`, rồi tự dựng prompt với bất kỳ LLM nào.

---

## Tám. Nhịp bảo trì và đóng góp

Kho này là **bản chụp mở của bộ máy lập lá số và bộ dữ liệu**, không phải một sản phẩm mã nguồn mở được bảo trì toàn thời gian. Nói rõ để khỏi phải đoán:

- **Đồng bộ bộ máy:** khi web phát hành bản mới thì đồng bộ tầng bộ máy trong `lib/ziwei/` và gắn tag. Kho lời luận, luận giải AI và frontend của site thương mại không nằm trong phạm vi đồng bộ.
- **Issue:** có xem, nhưng trả lời có thể không kịp. Câu hỏi có bước tái hiện, hoặc có một lá cụ thể (năm, tháng, ngày, giờ + giới + câu nào sai), được xử lý trước.
- **PR:** hoan nghênh, nhất là kiểm thử hồi quy, sửa chuẩn và tài liệu. Sửa đụng đến quy tắc lập lá số thì kèm căn cứ (nguyên văn cổ thư, hoặc một bảng đối chiếu kiểm được).

---

## Chín. Giấy phép

Kho này cấp phép thành bốn phần. Ba phần đầu là giấy phép rộng, **dùng thương mại không hạn chế**. Thư mục nguyên văn thầy Ni **không được dùng thương mại**:

| Nội dung | Giấy phép | Nói ngắn |
|------|------|--------|
| **Mã** (`lib/`, `app/`, `components/`) | [MIT License](./LICENSE) | Lấy đi dùng thoải mái, giữ tệp LICENSE là được |
| **Dữ liệu** (bộ mẫu 518,400 lá v3.0 và bộ luận giải 13 chiều v4.0 trong Releases) | [CC BY 4.0](./DATASET-LICENSE) · yêu cầu attribution | Dùng thương mại cũng được, **ghi nguồn dữ liệu là đủ** |
| **Nguyên văn cổ thư** (Cốt Tủy Phú, Tử Vi Đẩu Số Toàn Tập / Toàn Thư, v.v.) | Public Domain | Sách cổ thuộc phạm vi công cộng, không còn bản quyền |
| **Nguyên văn thầy Ni** ([`docs/tianji-ziwei/`](./docs/tianji-ziwei/)) | [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md) | Được trích, được đăng lại, ghi xuất xứ; **không được dùng thương mại**; phóng tác thì dùng cùng giấy phép |

**Một câu:** mã và dữ liệu cứ lấy mà dùng, dùng thương mại cũng được, mang theo liên kết nguồn là đủ. Nguyên văn thầy Ni chỉ dành cho học và nghiên cứu phi thương mại (nguyên văn thầy Ni được trích trong luận giải của bộ dữ liệu cũng không nằm trong phạm vi cấp phép của dữ liệu).

---

## Mười. Giới thiệu và liên hệ

### Triết lý dự án

Xem đầu trang này. Muốn tự dựng? Mã nguồn ở đây, lấy mà dùng. Ngại phiền? Vào [ouranic.cn](https://ouranic.cn/?from=gh-readme) dùng thẳng.

### Công nghệ

- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript
- **Giao diện:** Tailwind CSS + hệ thiết kế bằng CSS Variables
- **Lập lá số:** dựa trên [iztro](https://github.com/SylarLong/iztro) + lunar-javascript
- **Chuyển động:** Framer Motion

### Liên hệ

- Nền tảng trực tuyến: [ouranic.cn](https://ouranic.cn/?from=gh-readme) (đã hoàn tất đăng ký ICP: 京ICP备2026069066号-1)
- Báo lỗi, gửi bản sửa: xem [CONTRIBUTING.md](./CONTRIBUTING.md). Trao đổi cách dùng thì vào [mục Thảo luận](https://github.com/Renhuai123/ziwei-doushu/discussions)
- 💕 Một cú nhấp của bàn tay phát tài: theo dõi **王多鱼AI** trên 小红书 / 抖音 / 闲鱼 / X, để thấy bản mới sớm nhất và mở thêm nội dung Tử Vi
