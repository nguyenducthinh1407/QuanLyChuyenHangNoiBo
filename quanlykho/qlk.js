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
  window.location.href = "../pheduyet/pheduyet.html";
}

// mo Quanlynhapkho
function moQuanlynhapkho() {
  window.location.href = "../quanlynhapkho/qlnk.html";
}

// mo Nhanvienkho
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

// bảng thêm kho
const bangThemKho = document.querySelector(".bang_them_kho");
const btnHuy = document.querySelector(".huy");

bangThemKho.style.display = "none";

function openKhoForm(mode) {
  bangThemKho.style.display = "block";
  const maKhoInput = document.querySelector("input[name='ma_kho']");
  const tenKhoInput = document.querySelector("input[name='ten']");
  const diaChiInput = document.querySelector("input[name='dia_chi']");
  const formTitle = document.querySelector(".tao_moi");

  if (mode === "edit" && selectedKho) {
    isEditMode = true;
    maKhoInput.value = selectedKho.ma_kho || "";
    tenKhoInput.value = selectedKho.ten || "";
    diaChiInput.value = selectedKho.dia_chi || "";
    maKhoInput.style.display = "block";
    maKhoInput.previousElementSibling.style.display = "block";
  } else {
    isEditMode = false;
    maKhoInput.value = "";
    tenKhoInput.value = "";
    diaChiInput.value = "";
    maKhoInput.style.display = "none";
    maKhoInput.previousElementSibling.style.display = "none";
  }
}

function openthem() {
  openKhoForm("add");
}

function opensua() {
  if (selectedKho) {
    openKhoForm("edit");
  } else {
    alert("Vui lòng chọn một kho để chỉnh sửa.");
  }
}

btnHuy.addEventListener("click", function () {
  bangThemKho.style.display = "none";
});

//API Kho
var duLieuKho = document.querySelector(".dulieu");

let selectedKho = null;
let isEditMode = false;

function renderKho(dlKho) {
  var htmls = dlKho
    .slice()
    .reverse()
    .map(function (dlk) {
      return `
      <div class="dl" data-ma-kho="${dlk.ma_kho}">
        <div>${dlk.ma_kho}</div>
        <div>${dlk.ten}</div>
        <div>${dlk.dia_chi}</div>
      </div>
    `;
    });
  duLieuKho.innerHTML = htmls.join("");

  document.querySelectorAll(".dl").forEach((row) => {
    row.addEventListener("click", function () {
      const maKho = this.dataset.maKho;
      selectedKho = dlKho.find((kho) => kho.ma_kho == maKho);
      console.log("Kho đã chọn:", selectedKho);
    });
  });
}

function getKho(callback) {
  fetch("https://localhost:7103/api/QuanLyKho/getAllQuanLyKho")
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

function start() {
  getKho(function (dlKho) {
    console.log(dlKho);
    renderKho(dlKho);
    xuLyTaoMoi();
  });
}

//thêm kho
function xuLyTaoMoi() {
  var taoMoiKho = document.querySelector(".luu");

  if (taoMoiKho) {
    taoMoiKho.onclick = function (event) {
      event.preventDefault();
      var maKho = document.querySelector("input[name='ma_kho']").value;
      var tenKho = document.querySelector("input[name='ten']").value;
      var diaChi = document.querySelector("input[name='dia_chi']").value;

      var khoData = {
        ma_kho: maKho,
        ten: tenKho,
        dia_chi: diaChi,
      };

      if (isEditMode) {
        updateKho(khoData);
      } else {
        createKho(khoData);
      }
    };
  } else {
    console.error("Không tìm thấy nút 'Lưu' với class '.luu'.");
  }
}

function createKho(data) {
  fetch("https://localhost:7103/api/QuanLyKho/createQuanLyKho", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result.TrangThaiCode === 200) {
        alert("Thêm kho thành công!");
        document.querySelector(".bang_them_kho").style.display = "none";
        start();
      } else {
        const msg = result && result.ThongBaoLoi ? result.ThongBaoLoi : "Lỗi";
        alert("Thêm kho thất bại: " + msg);
      }
    })
    .catch((error) => {
      alert("Có lỗi xảy ra khi thêm kho.");
      console.error("Error:", error);
    });
}

function updateKho(data) {
  fetch("https://localhost:7103/api/QuanLyKho/updateQuanLyKho", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result && result.TrangThaiCode === 200) {
        alert("Cập nhật kho thành công!");
        document.querySelector(".bang_them_kho").style.display = "none";
        start();
      } else {
        const msg =
          result && result.ThongBaoLoi
            ? result.ThongBaoLoi
            : "Không rõ nguyên nhân";
        alert("Cập nhật kho thất bại: " + msg);
      }
    })
    .catch((error) => {
      alert("Có lỗi xảy ra khi cập nhật kho.");
      console.error("Error:", error);
    });
}

function deleteKho(maKho) {
  fetch(
    `https://localhost:7103/api/QuanLyKho/deleteQuanLyKho?ma_kho=${maKho}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.TrangThaiCode === 200) {
        alert("Kho đã được xóa thành công.");
        start();
      } else {
        alert("Không thể xóa kho: " + result.ThongBaoLoi);
      }
    })
    .catch((error) => {
      alert("Có lỗi xảy ra khi xóa kho.");
      console.error("Error:", error);
    });
}

function openxoa() {
  if (selectedKho) {
    if (confirm(`Bạn có chắc chắn muốn xóa kho ${selectedKho.ten} không?`)) {
      deleteKho(selectedKho.ma_kho);
    }
  } else {
    alert("Vui lòng chọn một kho để xóa.");
  }
}
start();
