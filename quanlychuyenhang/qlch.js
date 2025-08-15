//thông báo
const item2 = document.querySelector(".item2_link");
const bangThongbao = item2.querySelector(".bang_thong_bao");

item2.addEventListener("click", function (event) {
  event.preventDefault();
  bangThongbao.style.display = "none";

  event.stopPropagation();
});

bangThongbao.addEventListener("click", function (event) {
  event.stopPropagation();
});

document.addEventListener("click", function () {
  bangThongbao.style.display = "none";
});

// mo phe duyet
function moPheduyet() {
  window.location.href = "../pheduyet/pheduyet.html";
}
// mo Kho
function moQuanlykho() {
  window.location.href = "../quanlykho/qlk.html";
}
// mo Quanlynhapkho
function moQuanlynhapkho() {
  window.location.href = "../quanlynhapkho/qlnk.html";
}

// mo Quanlynhanvienkho
function moQuanlynhanvienkho() {
  window.location.href = "../quanlynhanvienkho/qlnvk.html";
}

function moQuanlysanpham() {
  window.location.href = "../quanlysanpham/qlsp.html";
}

// mo Quanlychuyenhang
function moQuanlychuyenhang() {
  window.location.href = "../quanlychuyenhang/qlch.html";
}

//thêm kho
const bangThemChuyenHang = document.querySelector(".bang_them_chuyen_hang");
const btnHuy = document.querySelector(".huy");

bangThemChuyenHang.style.display = "none";

function openthem() {
  bangThemChuyenHang.style.display = "block";
  document.querySelector(".form_them_chuyen_hang").dataset.mode = "add";
  clearFormAndDetails();
  document.querySelector(".ma_phieu_chuyen span").textContent = "Mã phiếu chuyển:";
  document.querySelector(".kho_xuat span").textContent = "Kho xuất: K01";
  
  //  có cột thao tác trong form thêm mới
  const headerChiTiet = document.querySelector(".thong_tin_pchct");
  const thaoTacHeader = headerChiTiet.querySelector(".thao_tac_ct");
  if (thaoTacHeader) {
    thaoTacHeader.remove();
  }
}

btnHuy.addEventListener("click", function () {
  bangThemChuyenHang.style.display = "none";
});

//API ChuyenKho
var duLieuChuyenHang = document.querySelector(".dulieu");

let selectedChuyenHang = null; // Biến toàn cục để lưu trữ dữ liệu phiếu chuyển hàng được chọn

function renderChuyenHang(dlChuyenHang, dsTrangThai) {
  var htmls = dlChuyenHang
    .slice()
    .reverse()
    .map(function (dlch) {
      var tt = dsTrangThai.find((s) => s.ma_trang_thai == dlch.ma_trang_thai);
      var ten_trang_thai = tt ? tt.ten_trang_thai : "Không rõ";
      return `
      <div class="dl" data-ma-phieu-chuyen="${dlch.ma_phieu_chuyen}">
        <div>${dlch.ma_phieu_chuyen}</div>
        <div>${dlch.kho_xuat}</div>
        <div>${dlch.kho_nhap}</div>
        <div>${dlch.ma_nv_tao}</div>
        <div>${dlch.ngay_chuyen}</div>
        <div>${ten_trang_thai}</div>
        <div>${dlch.dien_giai}</div>
      </div>
    `;
    });
  duLieuChuyenHang.innerHTML = htmls.join("");

  document.querySelectorAll('.dl').forEach(row => {
    row.addEventListener('click', function() {
      
      document.querySelectorAll('.dl').forEach(r => r.classList.remove('selected'));
      this.classList.add('selected');
      const maPhieuChuyen = this.dataset.maPhieuChuyen;
      selectedChuyenHang = dlChuyenHang.find(ch => ch.ma_phieu_chuyen == maPhieuChuyen);
      console.log('Phiếu chuyển đã chọn:', selectedChuyenHang);
    });
  });
  
}

function start() {
  Promise.all([
    fetch(
      "https://localhost:7103/api/QuanLyChuyenHang/getAllQuanLyChuyenHang"
    ).then((res) => res.json()),
    fetch(
      "https://localhost:7103/api/TrangThaiPhieuChuyen/getAllTrangThaiPhieuChuyen"
    ).then((res) => res.json()),
  ]).then(([dlChuyenHang, dlTrangThai]) => {
    renderChuyenHang(dlChuyenHang, dlTrangThai);
  });
}



// Thêm nhiều phiếu chuyển
document.addEventListener("DOMContentLoaded", (event) => {
  const phieuChuyenHangChiTiet = document.querySelector(
    ".phieu_chuyen_hang_chi_tiet"
  );

  const addRowListener = () => {
    const inputSl = phieuChuyenHangChiTiet.querySelector(
      ".nhap_tt:last-child .sl input"
    );
    if (inputSl) {
      inputSl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const newRow = document.createElement("div");
          newRow.classList.add("nhap_tt");
          newRow.innerHTML = `
                        <div class="mct">
                        </div>
                        <div class="msp">
                            <input type="text">
                        </div>
                        <div class="sl">
                            <input type="text">
                        </div>
                        <div class="thao_tac_ct">
                            <button class="icon-btnxoa-dong icon-xoa-dong" onclick="xoaDongSanPham(this)" style="background: none; border: none; cursor: pointer; padding: 0px 8px;">
                                <i class="material-icons">delete</i>
                            </button>
                        </div>
                    `;
          phieuChuyenHangChiTiet.appendChild(newRow);

          addRowListener();
        }
      });
    }
  };

  addRowListener();
  xuLyTaoMoi();
});

//thêm phiếu chuyển kho
function xuLyTaoMoi() {
  var taoMoiChuyenHang = document.querySelector(".luu");

  if (taoMoiChuyenHang) {
    taoMoiChuyenHang.addEventListener("click", async function (event) {
      event.preventDefault();

      const formMode = document.querySelector(".form_them_chuyen_hang").dataset.mode;
      const maPhieuChuyenHienTai = document.querySelector(".form_them_chuyen_hang").dataset.maPhieuChuyen;

      var khoNhapElement = document.querySelector("input[name='kho_nhap']");
      var khoNhap = khoNhapElement ? khoNhapElement.value.trim() : "";
      var maNhanVienTaoElement = document.querySelector("input[name='ma_nv_tao']");
      var maNhanVienTao = maNhanVienTaoElement ? maNhanVienTaoElement.value.trim() : "";
      var ngayChuyenElement = document.querySelector("input[name='ngay_chuyen']");
      var ngayChuyen = ngayChuyenElement ? ngayChuyenElement.value.trim() : "";
      if (!ngayChuyen) {
          const today = new Date();
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const day = String(today.getDate()).padStart(2, '0');
          ngayChuyen = `${year}-${month}-${day}`;
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(ngayChuyen)) {
      
          ngayChuyen = convertDateFormat(ngayChuyen);
      }
      var dienGiaiElement = document.querySelector("input[name='dien_giai']");
      var dienGiai = dienGiaiElement ? dienGiaiElement.value.trim() : "";

      var chuyenhangData = {
        kho_nhap: khoNhap,
        ma_nv_tao: maNhanVienTao,
        ngay_chuyen: ngayChuyen,
        dien_giai: dienGiai,
      };

      if (formMode === "edit") {
        chuyenhangData.ma_phieu_chuyen = maPhieuChuyenHienTai;
        if (selectedChuyenHang && typeof selectedChuyenHang.ma_trang_thai !== "undefined") {
          chuyenhangData.ma_trang_thai = selectedChuyenHang.ma_trang_thai;
        }
        const success = await updateChuyenHang(chuyenhangData);
        if (success) {
            const phieuChuyenHangChiTiet = document.querySelector(".phieu_chuyen_hang_chi_tiet");
            const chiTietRows = phieuChuyenHangChiTiet.querySelectorAll(".nhap_tt");
            
            for (const row of chiTietRows) {
                const maChiTiet = row.dataset.maChiTietPhieuChuyen;
                const maSanPham = row.querySelector(".msp input").value.trim();
                const soLuong = parseInt(row.querySelector(".sl input").value.trim());

                if (maChiTiet && maSanPham && soLuong) {
                    await updateChiTietPhieuChuyen({
                        ma_chi_tiet: maChiTiet,
                        ma_phieu_chuyen: maPhieuChuyenHienTai,
                        ma_san_pham: maSanPham,
                        so_luong: soLuong
                    });
                } else if (maSanPham && soLuong) {
                    await createChiTietPhieuChuyen([{
                        ma_phieu_chuyen: maPhieuChuyenHienTai,
                        ma_san_pham: maSanPham,
                        so_luong: soLuong
                    }]);
                }
            }
            document.querySelector(".bang_them_chuyen_hang").style.display = "none";
            start();
            clearFormAndDetails();
        }
      } else {
        const chuyenhangDataTaoMoi = { ...chuyenhangData, ma_trang_thai: "1" };
        createChuyenHang(chuyenhangDataTaoMoi)
          .then((maPhieuChuyenMoi) => {
            const phieuChuyenHangChiTiet = document.querySelector(".phieu_chuyen_hang_chi_tiet");
            const chiTietRows = phieuChuyenHangChiTiet.querySelectorAll(".nhap_tt");
            const chiTietDataArray = [];
            chiTietRows.forEach((row) => {
              const maSanPhamElement = row.querySelector(".msp input");
              const soLuongElement = row.querySelector(".sl input");

              const maSanPham = maSanPhamElement ? maSanPhamElement.value.trim() : "";
              const soLuong = soLuongElement ? soLuongElement.value.trim() : "";

              if (maSanPham && soLuong) {
                chiTietDataArray.push({
                  ma_phieu_chuyen: maPhieuChuyenMoi,
                  ma_san_pham: maSanPham,
                  so_luong: parseInt(soLuong),
                });
              }
            });

            if (chiTietDataArray.length > 0) {
              createChiTietPhieuChuyen(chiTietDataArray)
                .then(() => {
                  alert("Tạo phiếu chuyển hàng thành công!");
                  document.querySelector(".bang_them_chuyen_hang").style.display = "none";
                  start();
                  clearFormAndDetails();
                });

            }
          })
          .catch((error) => {});
      }
    });
  } 
}

function createChiTietPhieuChuyen(data) {
  return fetch(
    "https://localhost:7103/api/ChiTietPhieuChuyen/createChiTietPhieuChuyen",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson;
        } catch (e) {
          
        }
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${JSON.stringify(
            errorDetails
          )}`
        );
      }
      return response.json();
    })
    .then((result) => {
    });
}

function createChuyenHang(data) {
  return fetch(
    "https://localhost:7103/api/QuanLyChuyenHang/createQuanLyChuyenHang",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        let errorDetails = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson;
        } catch (e) {}
        throw new Error(
          `HTTP error! status: ${response.status}, details: ${JSON.stringify(
            errorDetails
          )}`
        );
      }
      return response.json();
    })
    .then((result) => {
      document.querySelector(".bang_them_chuyen_hang").style.display = "none";

      if (result.TrangThaiCode === 200) {
        const maPhieuChuyenMoi = result.ma_phieu_chuyen;
        return maPhieuChuyenMoi;
      } else {
        throw new Error(result.ThongBaoLoi || "Tạo phiếu chuyển hàng chính thất bại");
      }
    });
}

function convertDateFormat(dateString) {
  const parts = dateString.split(/[-\/]/);
  if (parts.length === 3) {
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateString;
}

function renderChiTietPhieuChuyen(chiTietPhieuChuyen) {
  const phieuChuyenHangChiTietDiv = document.querySelector(".phieu_chuyen_hang_chi_tiet");
  
  
  phieuChuyenHangChiTietDiv.querySelectorAll('.nhap_tt').forEach(row => row.remove());

  if (chiTietPhieuChuyen && chiTietPhieuChuyen.length > 0) {
    chiTietPhieuChuyen.forEach(chiTiet => {
      const newRow = document.createElement("div");
      newRow.classList.add("nhap_tt");
      newRow.dataset.maChiTietPhieuChuyen = chiTiet.ma_chi_tiet;
      newRow.innerHTML = `
        <div class="mct">${chiTiet.ma_chi_tiet}</div>
        <div class="msp">
            <input type="text" name="msp" value="${chiTiet.ma_san_pham}">
        </div>
        <div class="sl">
            <input type="text" name="sl" value="${chiTiet.so_luong}">
        </div>
        <div class="thao_tac_ct">
            <button class="icon-btnxoa-dong icon-xoa-dong" onclick="xoaDongSanPham(this)" style="background: none; border: none; cursor: pointer; padding: 0px 8px;">
                <i class="material-icons">delete</i>
            </button>
        </div>
      `;
      phieuChuyenHangChiTietDiv.appendChild(newRow);
    });
  } else {
    // Nếu không có chi tiết thêm một dòng trống
    const newRow = document.createElement("div");
    newRow.classList.add("nhap_tt");
    newRow.innerHTML = `
        <div class="mct">
        </div>
        <div class="msp">
            <input type="text" name="msp">
        </div>
        <div class="sl">
            <input type="text" name="sl">
        </div>
        <div class="thao_tac_ct">
            <button class="icon-btnxoa-dong icon-xoa-dong" onclick="xoaDongSanPham(this)" style="background: none; border: none; cursor: pointer; padding: 0px 8px;">
                <i class="material-icons">delete</i>
            </button>
        </div>
    `;
    phieuChuyenHangChiTietDiv.appendChild(newRow);
  }
  
  const inputSl = phieuChuyenHangChiTietDiv.querySelector(".nhap_tt:last-child .sl input");
  if (inputSl) {
    inputSl.focus(); 
  }
}

function clearFormAndDetails() {
  document.querySelector("input[name='kho_nhap']").value = "";
  document.querySelector("input[name='ma_nv_tao']").value = "";
  document.querySelector("input[name='ngay_chuyen']").value = "";
  document.querySelector("input[name='dien_giai']").value = "";


  document.querySelectorAll("input").forEach(input => {
    input.disabled = false;
  });
  
 
  const btnLuu = document.querySelector(".luu");
  const btnHuy = document.querySelector(".huy");
  if (btnLuu) btnLuu.style.display = "inline-block";
  if (btnHuy) btnHuy.textContent = "Hủy";
}

document.addEventListener("DOMContentLoaded", function () {
  start();
});

function opensua() {
  if (selectedChuyenHang) {
    const formThemChuyenHang = document.querySelector(".form_them_chuyen_hang");
    const bangThemChuyenHang = document.querySelector(".bang_them_chuyen_hang");

    bangThemChuyenHang.style.display = "block";
    
    formThemChuyenHang.querySelector(".ma_phieu_chuyen span").textContent = `Mã phiếu chuyển: ${selectedChuyenHang.ma_phieu_chuyen}`;
    formThemChuyenHang.querySelector(".kho_xuat span").textContent = `Kho xuất: ${selectedChuyenHang.kho_xuat}`;
    formThemChuyenHang.querySelector("input[name='kho_nhap']").value = selectedChuyenHang.kho_nhap;
    formThemChuyenHang.querySelector("input[name='ma_nv_tao']").value = selectedChuyenHang.ma_nv_tao;
    const ngayChuyenFormatted = new Date(selectedChuyenHang.ngay_chuyen).toISOString().split('T')[0];
    formThemChuyenHang.querySelector("input[name='ngay_chuyen']").value = ngayChuyenFormatted;
    formThemChuyenHang.querySelector("input[name='dien_giai']").value = selectedChuyenHang.dien_giai;

    formThemChuyenHang.dataset.mode = "edit";
    formThemChuyenHang.dataset.maPhieuChuyen = selectedChuyenHang.ma_phieu_chuyen;
    
    
    fetch(`https://localhost:7103/api/ChiTietPhieuChuyen/getByMaPhieuChuyen/${selectedChuyenHang.ma_phieu_chuyen}`)
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Lỗi khi lấy chi tiết phiếu chuyển. Phản hồi của máy chủ:", errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(chiTietPhieuChuyen => {
        renderChiTietPhieuChuyen(chiTietPhieuChuyen);
      })
      .catch(error => console.error("Lỗi khi lấy chi tiết phiếu chuyển:", error));
  } else {
    alert('Vui lòng chọn một phiếu chuyển để chỉnh sửa.');
  }
}

function updateChuyenHang(data) {
  return fetch("https://localhost:7103/api/QuanLyChuyenHang/updateQuanLyChuyenHang", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      alert("Cập nhật phiếu chuyển hàng thành công!");
      return true;
    } else {
      console.log("Update result with error details:", result); 
      let displayMessage = result.ThongBaoLoi;
      if (!displayMessage) { 
        displayMessage = "Lỗi không xác định từ server. Chi tiết trong console.";
        if (result) {
            displayMessage = `Lỗi không xác định từ server. Phản hồi: ${JSON.stringify(result)}`;
        }
      }
      alert(`Cập nhật phiếu chuyển hàng thất bại: ${displayMessage}`);
      return false;
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Có lỗi xảy ra khi cập nhật phiếu chuyển hàng.");
    return false;
  });
}

function updateChiTietPhieuChuyen(data) {
  return fetch("https://localhost:7103/api/ChiTietPhieuChuyen/updateChiTietPhieuChuyen", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      console.log("Cập nhật chi tiết phiếu chuyển thành công!");
      return true;
    } else {
      console.error("Cập nhật chi tiết phiếu chuyển thất bại: " + result.ThongBaoLoi);
      return false;
    }
  })
  .catch(error => {
    console.error("Error updating chi tiet phieu chuyen:", error);
    return false;
  });
}

function deleteChiTietPhieuChuyen(maChiTietPhieuChuyen) {
  return fetch(`https://localhost:7103/api/ChiTietPhieuChuyen/deleteChiTietPhieuChuyen/${maChiTietPhieuChuyen}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      console.log("Xóa chi tiết phiếu chuyển thành công!");
      return true;
    } else {
      console.error("Xóa chi tiết phiếu chuyển thất bại: " + result.ThongBaoLoi);
      return false;
    }
  })
  .catch(error => {
    console.error("Error deleting chi tiet phieu chuyen:", error);
    return false;
  });
}

function openxoa() {
  if (selectedChuyenHang) {
    if (confirm(`Bạn có chắc chắn muốn xóa phiếu chuyển ${selectedChuyenHang.ma_phieu_chuyen} không?`)) {
      deleteChuyenHang(selectedChuyenHang.ma_phieu_chuyen);
    }
  } else {
    alert('Vui lòng chọn một phiếu chuyển để xóa.');
  }
}

function deleteChuyenHang(maPhieuChuyen) {
  fetch(`https://localhost:7103/api/QuanLyChuyenHang/deleteQuanLyChuyenHang?ma_phieu_chuyen=${maPhieuChuyen}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      alert("Phiếu chuyển đã được xóa thành công.");
      
      const rowToRemove = document.querySelector(`[data-ma-phieu-chuyen="${maPhieuChuyen}"]`);
      if (rowToRemove) {
        rowToRemove.remove();
      }
      
      if (selectedChuyenHang && selectedChuyenHang.ma_phieu_chuyen === maPhieuChuyen) {
        selectedChuyenHang = null;
      }
    } else {
      alert("Không thể xóa phiếu chuyển: " + result.ThongBaoLoi);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi xóa phiếu chuyển.");
    console.error("Error:", error);
  });
}


function xoaDongSanPham(button) {
  const row = button.closest('.nhap_tt');
  const maChiTietPhieuChuyen = row.dataset.maChiTietPhieuChuyen;
  
  if (maChiTietPhieuChuyen) {
    
    if (confirm('Bạn có chắc chắn muốn xóa dòng sản phẩm này không?')) {
      
      row.remove();
      
      
      deleteChiTietPhieuChuyen(maChiTietPhieuChuyen)
        .then(success => {
          if (success) {
            
            console.log('Đã xóa dòng sản phẩm thành công!');
          } else {
            
            alert('Không thể xóa dòng sản phẩm từ database. Vui lòng thử lại.');
            
          }
        })
        .catch(error => {
          console.error('Lỗi khi xóa:', error);
          alert('Có lỗi xảy ra khi xóa dòng sản phẩm.');
        });
    }
  } else {
    
    if (confirm('Bạn có chắc chắn muốn xóa dòng sản phẩm này không?')) {
      row.remove();
    }
  }
}

function openxem() {
  if (selectedChuyenHang) {
    const formThemChuyenHang = document.querySelector(".form_them_chuyen_hang");
    const bangThemChuyenHang = document.querySelector(".bang_them_chuyen_hang");

    bangThemChuyenHang.style.display = "block";
    
    // Hiển thị thông tin phiếu chuyển
    formThemChuyenHang.querySelector(".ma_phieu_chuyen span").textContent = `Mã phiếu chuyển: ${selectedChuyenHang.ma_phieu_chuyen}`;
    formThemChuyenHang.querySelector(".kho_xuat span").textContent = `Kho xuất: ${selectedChuyenHang.kho_xuat}`;
    formThemChuyenHang.querySelector("input[name='kho_nhap']").value = selectedChuyenHang.kho_nhap;
    formThemChuyenHang.querySelector("input[name='ma_nv_tao']").value = selectedChuyenHang.ma_nv_tao;
    const ngayChuyenFormatted = new Date(selectedChuyenHang.ngay_chuyen).toISOString().split('T')[0];
    formThemChuyenHang.querySelector("input[name='ngay_chuyen']").value = ngayChuyenFormatted;
    formThemChuyenHang.querySelector("input[name='dien_giai']").value = selectedChuyenHang.dien_giai;

    
    formThemChuyenHang.dataset.mode = "view";
    formThemChuyenHang.dataset.maPhieuChuyen = selectedChuyenHang.ma_phieu_chuyen;
    
    
    formThemChuyenHang.querySelectorAll("input").forEach(input => {
      input.disabled = true;
    });
    
  
    const btnLuu = formThemChuyenHang.querySelector(".luu");
    const btnHuy = formThemChuyenHang.querySelector(".huy");
    if (btnLuu) btnLuu.style.display = "none";
    if (btnHuy) btnHuy.textContent = "Đóng";
    
    
    fetch(`https://localhost:7103/api/ChiTietPhieuChuyen/getByMaPhieuChuyen/${selectedChuyenHang.ma_phieu_chuyen}`)
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Lỗi khi lấy chi tiết phiếu chuyển. Phản hồi của máy chủ:", errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(chiTietPhieuChuyen => {
        renderChiTietPhieuChuyenView(chiTietPhieuChuyen);
      })
      .catch(error => console.error("Lỗi khi lấy chi tiết phiếu chuyển:", error));
  } else {
    alert('Vui lòng chọn một phiếu chuyển để xem.');
  }
}


function renderChiTietPhieuChuyenView(chiTietPhieuChuyen) {
  const phieuChuyenHangChiTietDiv = document.querySelector(".phieu_chuyen_hang_chi_tiet");
  
  
  phieuChuyenHangChiTietDiv.querySelectorAll('.nhap_tt').forEach(row => row.remove());

  if (chiTietPhieuChuyen && chiTietPhieuChuyen.length > 0) {
    chiTietPhieuChuyen.forEach(chiTiet => {
      const newRow = document.createElement("div");
      newRow.classList.add("nhap_tt");
      newRow.dataset.maChiTietPhieuChuyen = chiTiet.ma_chi_tiet;
      newRow.innerHTML = `
        <div class="mct">${chiTiet.ma_chi_tiet}</div>
        <div class="msp">
            <input type="text" name="msp" value="${chiTiet.ma_san_pham}" disabled>
        </div>
        <div class="sl">
            <input type="text" name="sl" value="${chiTiet.so_luong}" disabled>
        </div>
        <div class="thao_tac_ct">
            <!-- Không có nút xóa trong chế độ xem -->
        </div>
      `;
      phieuChuyenHangChiTietDiv.appendChild(newRow);
    });
  } else {
    
    const newRow = document.createElement("div");
    newRow.classList.add("nhap_tt");
    newRow.innerHTML = `
        <div class="mct">-</div>
        <div class="msp">
            <input type="text" name="msp" value="Không có dữ liệu" disabled>
        </div>
        <div class="sl">
            <input type="text" name="sl" value="-" disabled>
        </div>
        <div class="thao_tac_ct">
        </div>
    `;
    phieuChuyenHangChiTietDiv.appendChild(newRow);
  }
}
