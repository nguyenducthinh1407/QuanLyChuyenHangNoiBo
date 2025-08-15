//thông báo
const item2 = document.querySelector(".item2_link");
const bangThongbao = item2.querySelector(".bang_thong_bao");

item2.addEventListener("click", function (event) {
  event.preventDefault();
  bangThongbao.style.display = "block";

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
  window.location.href = "../pheduyet/pheduyet.html"
}

// mo Kho
function moQuanlykho() {
  window.location.href = "../quanlykho/qlk.html";
}

// mo Quanlynhapkho
function moQuanlynhapkho(){
  window.location.href = "../quanlynhapkho/qlnk.html";
}

// mo Quanlynhanvienkho
function moQuanlynhanvienkho(){
  window.location.href = "../quanlynhanvienkho/qlnvk.html"
}

function moQuanlysanpham(){
  window.location.href = "../quanlysanpham/qlsp.html"
}

// mo Quanlychuyenhang
function moQuanlychuyenhang(){
  window.location.href = "../quanlychuyenhang/qlch.html"
}
//thêm sản phẩm
const bang_them_nhap_kho = document.querySelector(".bang_them_nhap_kho");
const btnHuy = document.querySelector(".huy");

bang_them_nhap_kho.style.display = "none";

function openthem() {
  bang_them_nhap_kho.style.display = "block";
  selectedNhapKho = null;   
  document.querySelector("input[name='ma_san_pham']").value = '';
  document.querySelector("input[name='so_luong']").value = '';
  document.querySelector("input[name='ngay_nhap']").value = '';
  document.querySelector("input[name='dien_giai']").value = '';
  if (document.querySelector("input[name='ma_nhap_hidden']")) {
      document.querySelector("input[name='ma_nhap_hidden']").value = '';
  }
}

btnHuy.addEventListener("click", function () {
  bang_them_nhap_kho.style.display = "none";
});

function opensua() {
  if (selectedNhapKho) {
    bang_them_nhap_kho.style.display = "block";
    document.querySelector("input[name='ma_san_pham']").value = selectedNhapKho.ma_san_pham;
    document.querySelector("input[name='so_luong']").value = selectedNhapKho.so_luong;
    document.querySelector("input[name='ngay_nhap']").value = convertDateFormat(selectedNhapKho.ngay_nhap); 
    document.querySelector("input[name='dien_giai']").value = selectedNhapKho.dien_giai;
    if (document.querySelector("input[name='ma_nhap_hidden']")) {
        document.querySelector("input[name='ma_nhap_hidden']").value = selectedNhapKho.ma_nhap;
    }
  } else {
    alert("Vui lòng chọn một phiếu nhập kho để chỉnh sửa.");
  }
}

//API Nhapkho
var duLieuNhapKho = document.querySelector(".dulieu");

let selectedNhapKho = null; 

function renderNhapKho(dlNhapKho, dsSanPham) {
  var htmls = dlNhapKho.slice().reverse().map(function (dlnk) {
    var sp = dsSanPham.find(s => s.ma_sp == dlnk.ma_san_pham);
    var ten_san_pham = sp ? sp.ten_sp : "Không rõ";
    return `
      <div class="dl" data-ma-nhap="${dlnk.ma_nhap}">
        <div>${dlnk.ma_nhap}</div>
        <div>${dlnk.ma_kho}</div>
        <div>${ten_san_pham}</div>
        <div>${dlnk.so_luong}</div>
        <div>${dlnk.ngay_nhap}</div>
        <div>${dlnk.dien_giai}</div>
      </div>
    `;
  });
  duLieuNhapKho.innerHTML = htmls.join("");

  document.querySelectorAll('.dl').forEach(row => {
    row.addEventListener('click', function() {
      const maNhap = this.dataset.maNhap;
      selectedNhapKho = dlNhapKho.find(nk => nk.ma_nhap == maNhap);
      console.log('Phiếu nhập đã chọn:', selectedNhapKho);
    });
  });
}


function start() {
  Promise.all([
    fetch("https://localhost:7103/api/QuanLyNhapKho/getAllQuanLyNhapKho").then(res => res.json()),
    fetch("https://localhost:7103/api/QuanLySanPham/getAllQuanLySanPham").then(res => res.json())
  ]).then(([dlNhapKho, dlSanPham]) => {
    renderNhapKho(dlNhapKho, dlSanPham);
  });
}

//thêm phiếu nhập kho
function xuLyTaoMoi() {
  var taoMoiNhapKho = document.querySelector(".luu");

  if (taoMoiNhapKho) {
    taoMoiNhapKho.addEventListener("click", function(event) {
      console.log("Sự kiện click nút Lưu đã kích hoạt.");
      event.preventDefault(); 
      var maSanPham = document.querySelector("input[name='ma_san_pham']").value.trim();
      var soLuongInput = document.querySelector("input[name='so_luong']").value.trim();
      var ngayNhapRaw = document.querySelector("input[name='ngay_nhap']").value.trim();
      var dienGiai = document.querySelector("input[name='dien_giai']").value.trim();

      if (!maSanPham || !soLuongInput || !ngayNhapRaw || !dienGiai) {
        alert("Vui lòng điền đầy đủ tất cả các trường.");
        return;
      }

      var soLuong = parseInt(soLuongInput);
      if (isNaN(soLuong)) {
        alert("Số lượng phải là một số hợp lệ.");
        return;
      }
      
      var ngayNhap = convertDateFormat(ngayNhapRaw); 

      var nhapkhoData = {
        ma_san_pham: maSanPham,
        so_luong: soLuong,
        ngay_nhap: ngayNhap,
        dien_giai: dienGiai,
      };

      if (selectedNhapKho) {
        nhapkhoData.ma_nhap = selectedNhapKho.ma_nhap; 
        updateNhapKho(nhapkhoData);
      } else {
        createNhapKho(nhapkhoData);
      }
    }); 
  } else {
    console.error("Không tìm thấy nút 'Lưu' với class '.luu'.");
  }
}

function createNhapKho(data) {
  fetch("https://localhost:7103/api/QuanLyNhapKho/createQuanLyNhapKho", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Thêm phiếu nhập kho thành công!");
      document.querySelector(".bang_them_nhap_kho").style.display = "none";
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Thêm phiếu nhập kho thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi thêm phiếu nhập kho.");
  });
}

function convertDateFormat(dateString) {
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString; 
}

document.addEventListener("DOMContentLoaded", function() {
  start();
  xuLyTaoMoi(); 
});

function updateNhapKho(data) {
  fetch("https://localhost:7103/api/QuanLyNhapKho/updateQuanLyNhapKho", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Cập nhật phiếu nhập kho thành công!");
      document.querySelector(".bang_them_nhap_kho").style.display = "none";
      selectedNhapKho = null; // Clear selected after update
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Cập nhật phiếu nhập kho thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi cập nhật phiếu nhập kho.");
    console.error("Error:", error);
  });
}

function deleteNhapKho(maNhap) {
  fetch(`https://localhost:7103/api/QuanLyNhapKho/deleteQuanLyNhapKho?ma_nhap=${maNhap}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      alert("Phiếu nhập kho đã được xóa thành công.");
      start(); 
    } else {
      alert("Không thể xóa phiếu nhập kho: " + result.ThongBaoLoi);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi xóa phiếu nhập kho.");
    console.error("Error:", error);
  });
}

function openxoa() {
  if (selectedNhapKho) {
    if (confirm(`Bạn có chắc chắn muốn xóa phiếu nhập ${selectedNhapKho.ma_nhap} không?`)) {
      deleteNhapKho(selectedNhapKho.ma_nhap);
    }
  } else {
    alert("Vui lòng chọn một phiếu nhập kho để xóa.");
  }
}


