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


//tạo mới sản phẩm
const bangThemSanPham = document.querySelector(".bang_them_san_pham");
const btnHuy = document.querySelector(".huy");

bangThemSanPham.style.display = "none";

function openthem() {
  bangThemSanPham.style.display = "block";
  selectedSanPham = null; 
  document.querySelector("input[name='ten_sp']").value = '';
  document.querySelector(".ma_loaisp select").value = ''; 
  document.querySelector("input[name='don_vi_tinh']").value = '';
  document.querySelector("input[name='don_gia_ban']").value = '';
  document.querySelector("input[name='so_luong_ton_kho']").value = '';
  document.querySelector("input[name='don_gia_nhap']").value = '';
  if (document.querySelector("input[name='ma_sp_hidden']")) {
      document.querySelector("input[name='ma_sp_hidden']").value = '';
  }
}

btnHuy.addEventListener("click", function () {
  bangThemSanPham.style.display = "none";
});

function opensua() {
  if (selectedSanPham) {
    bangThemSanPham.style.display = "block";
    document.querySelector("input[name='ten_sp']").value = selectedSanPham.ten_sp;
    document.querySelector(".ma_loaisp select").value = selectedSanPham.ma_loaisp;
    document.querySelector("input[name='don_vi_tinh']").value = selectedSanPham.don_vi_tinh;
    document.querySelector("input[name='don_gia_ban']").value = selectedSanPham.don_gia_ban;
    document.querySelector("input[name='so_luong_ton_kho']").value = selectedSanPham.so_luong_ton_kho;
    document.querySelector("input[name='don_gia_nhap']").value = selectedSanPham.don_gia_nhap;
    if (document.querySelector("input[name='ma_sp_hidden']")) {
        document.querySelector("input[name='ma_sp_hidden']").value = selectedSanPham.ma_sp;
    }
  } else {
    alert("Vui lòng chọn một sản phẩm để chỉnh sửa.");
  }
}

//API SanPham
var duLieuSanPham = document.querySelector(".dulieu");

let selectedSanPham = null; 

function renderSanPham(dlSanPham) {
  var htmls = dlSanPham.slice().reverse().map(function (dlsp) {
    return `
      <div class="dl" data-ma-sp="${dlsp.ma_sp}">
        <div>${dlsp.ma_sp}</div>
        <div>${dlsp.ten_sp}</div>
        <div>${dlsp.ma_loaisp}</div>
        <div>${dlsp.don_vi_tinh}</div>
        <div>${dlsp.don_gia_ban}</div>
        <div>${dlsp.so_luong_ton_kho}</div>
        <div>${dlsp.don_gia_nhap}</div>
      </div>
    `;
  });
  duLieuSanPham.innerHTML = htmls.join("");

  document.querySelectorAll('.dl').forEach(row => {
    row.addEventListener('click', function() {
      const maSp = this.dataset.maSp;
      selectedSanPham = dlSanPham.find(sp => sp.ma_sp == maSp);
      console.log('Sản phẩm đã chọn:', selectedSanPham);
    });
  });
}

function getSanPham(callback) {
  fetch("https://localhost:7103/api/QuanLySanPham/getAllQuanLySanPham")
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function start() {
  getSanPham(function (dlSanPham) {
    console.log(dlSanPham); 
    renderSanPham(dlSanPham);
  });
}

//thêm sản phẩm
function xuLyTaoMoi() {
  var taoMoiSanPham = document.querySelector(".luu");

  if (taoMoiSanPham) {
    taoMoiSanPham.onclick = function(event) {
      event.preventDefault(); 
      var tenSanPham = document.querySelector("input[name='ten_sp']").value;
      var maLoaiSanPham = parseInt(document.querySelector(".ma_loaisp select").value);
      var donViTinh = document.querySelector("input[name='don_vi_tinh']").value;
      var donGiaBan = parseFloat(document.querySelector("input[name='don_gia_ban']").value);
      var soLuongTonKho = parseInt(document.querySelector("input[name='so_luong_ton_kho']").value);
      var donGiaNhap = parseFloat(document.querySelector("input[name='don_gia_nhap']").value);

      var sanphamData = {
        ten_sp: tenSanPham,
        ma_loaisp: maLoaiSanPham,
        don_vi_tinh: donViTinh,
        don_gia_ban: donGiaBan,
        so_luong_ton_kho: soLuongTonKho,
        don_gia_nhap: donGiaNhap
      };

      if (selectedSanPham) {
        sanphamData.ma_sp = selectedSanPham.ma_sp; 
        updateSanPham(sanphamData);
      } else {
        createSanPham(sanphamData);
      }
    };
  } else {
    console.error("Không tìm thấy nút 'Lưu' với class '.luu'.");
  }
}

function createSanPham(data) {
  fetch("https://localhost:7103/api/QuanLySanPham/createQuanLySanPham", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Thêm sản phẩm thành công!");
      document.querySelector(".bang_them_san_pham").style.display = "none";
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Thêm sản phẩm thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi thêm san pham.");
  });
}

function updateSanPham(data) {
  fetch("https://localhost:7103/api/QuanLySanPham/updateQuanLySanPham", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result => {
    if (result && result.TrangThaiCode === 200) {
      alert("Cập nhật sản phẩm thành công!");
      document.querySelector(".bang_them_san_pham").style.display = "none";
      selectedSanPham = null; 
      start();
    } else {
      const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
      alert("Cập nhật sản phẩm thất bại: " + msg);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi cập nhật sản phẩm.");
    console.error("Error:", error);
  });
}

function deleteSanPham(maSp) {
  fetch(`https://localhost:7103/api/QuanLySanPham/deleteQuanLySanPham?ma_sp=${maSp}`, {
    method: "DELETE",
  })
  .then(response => response.json())
  .then(result => {
    if (result.TrangThaiCode === 200) {
      alert("Sản phẩm đã được xóa thành công.");
      start(); 
    } else {
      alert("Không thể xóa sản phẩm: " + result.ThongBaoLoi);
    }
  })
  .catch(error => {
    alert("Có lỗi xảy ra khi xóa sản phẩm.");
    console.error("Error:", error);
  });
}

function openxoa() {
  if (selectedSanPham) {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${selectedSanPham.ten_sp} không?`)) {
      deleteSanPham(selectedSanPham.ma_sp);
    }
  } else {
    alert("Vui lòng chọn một sản phẩm để xóa.");
  }
}

start();
xuLyTaoMoi();
