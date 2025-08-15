using Baocao.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json.Serialization;

namespace Baocao.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuanLyChuyenHangController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public QuanLyChuyenHangController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("getAllQuanLyChuyenHang")]
        public string GetQuanLyChuyenHang()
        {
            var connectionString = _configuration.GetConnectionString("QuanLyChuyenHangAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from Phieu_Chuyen_Hang", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<QuanLyChuyenHang> quanlychuyenhanglist = new List<QuanLyChuyenHang>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    QuanLyChuyenHang quanlychuyenhang = new QuanLyChuyenHang();
                    quanlychuyenhang.ma_phieu_chuyen = Convert.ToString(dt.Rows[i]["ma_phieu_chuyen"]);
                    quanlychuyenhang.kho_xuat = Convert.ToString(dt.Rows[i]["kho_xuat"]);
                    quanlychuyenhang.kho_nhap = Convert.ToString(dt.Rows[i]["kho_nhap"]);
                    quanlychuyenhang.ma_nv_tao = Convert.ToString(dt.Rows[i]["ma_nv_tao"]);
                    quanlychuyenhang.ngay_chuyen = Convert.ToDateTime(dt.Rows[i]["ngay_chuyen"]);
                    quanlychuyenhang.ma_trang_thai = Convert.ToInt32(dt.Rows[i]["ma_trang_thai"]);
                    quanlychuyenhang.dien_giai = Convert.ToString(dt.Rows[i]["dien_giai"]);
                    quanlychuyenhanglist.Add(quanlychuyenhang);
                }
            }
            if (quanlychuyenhanglist.Count > 0)
                return JsonConvert.SerializeObject(quanlychuyenhanglist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }
        }

        [HttpPost]
        [Route("createQuanLyChuyenHang")]
        public string createQuanLyChuyenHang(QuanLyChuyenHang quanLyChuyenHang)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyChuyenHangAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string errorMessage = "";
                    con.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                    {
                        errorMessage += e.Message + " ";
                    };
                    using (SqlCommand cmd = new SqlCommand("sThemPhieuChuyen", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@kho_nhap", quanLyChuyenHang.kho_nhap);
                        cmd.Parameters.AddWithValue("@ma_nv_tao", quanLyChuyenHang.ma_nv_tao);
                        cmd.Parameters.AddWithValue("@ngay_chuyen", quanLyChuyenHang.ngay_chuyen);
                        cmd.Parameters.AddWithValue("@trang_thai", quanLyChuyenHang.ma_trang_thai.ToString()); 
                        cmd.Parameters.AddWithValue("@dien_giai", quanLyChuyenHang.dien_giai);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        SqlParameter maPhieuChuyenParam = new SqlParameter("@ma_phieu_chuyen_out", SqlDbType.VarChar, 10); 
                        maPhieuChuyenParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(maPhieuChuyenParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        string maPhieuChuyen = null;
                        if (maPhieuChuyenParam.Value != DBNull.Value)
                        {
                            maPhieuChuyen = maPhieuChuyenParam.Value.ToString();
                        }

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Phiếu chuyển đã được tạo thành công";
                            response.ma_phieu_chuyen = maPhieuChuyen;
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = string.IsNullOrEmpty(errorMessage) ? "Không thể tạo Phiếu chuyển " : errorMessage.Trim();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }

        [HttpPost]
        [Route("updateTrangThaiPhieuChuyen")]
        public string UpdateTrangThaiPhieuChuyen([FromBody] UpdateTrangThaiRequest request)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyChuyenHangAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string errorMessage = "";
                    con.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                    {
                        errorMessage += e.Message + " ";
                    };
                    using (SqlCommand cmd = new SqlCommand("sUpdateTrangThaiPhieuChuyen", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_phieu_chuyen", request.ma_phieu_chuyen);
                        cmd.Parameters.AddWithValue("@new_ma_trang_thai", request.ma_trang_thai);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Cập nhật trạng thái phiếu chuyển thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = string.IsNullOrEmpty(errorMessage) ? "Không thể cập nhật trạng thái phiếu chuyển" : errorMessage.Trim();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }

        [HttpPut]
        [Route("updateQuanLyChuyenHang")]
        public string UpdateQuanLyChuyenHang([FromBody] QuanLyChuyenHang quanLyChuyenHang)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyChuyenHangAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string errorMessage = "";
                    con.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                    {
                        errorMessage += e.Message + " ";
                    };
                    using (SqlCommand cmd = new SqlCommand("sUpdatePhieuChuyen", con)) 
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_phieu_chuyen", quanLyChuyenHang.ma_phieu_chuyen);
                        cmd.Parameters.AddWithValue("@kho_nhap", quanLyChuyenHang.kho_nhap);
                        cmd.Parameters.AddWithValue("@ma_nv_tao", quanLyChuyenHang.ma_nv_tao);
                        cmd.Parameters.AddWithValue("@ngay_chuyen", quanLyChuyenHang.ngay_chuyen);
                        cmd.Parameters.AddWithValue("@ma_trang_thai", quanLyChuyenHang.ma_trang_thai);
                        cmd.Parameters.AddWithValue("@dien_giai", quanLyChuyenHang.dien_giai);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Cập nhật phiếu chuyển hàng thành công";
                            response.ma_phieu_chuyen = quanLyChuyenHang.ma_phieu_chuyen;
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = string.IsNullOrEmpty(errorMessage) ? "Không thể cập nhật phiếu chuyển hàng" : errorMessage.Trim();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }

        [HttpDelete]
        [Route("deleteQuanLyChuyenHang")]
        public string DeleteQuanLyChuyenHang(string ma_phieu_chuyen)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyChuyenHangAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    string errorMessage = "";
                    con.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                    {
                        errorMessage += e.Message + " ";
                    };
                    
                    
                    using (SqlCommand cmdChiTiet = new SqlCommand("DELETE FROM Chi_Tiet_Phieu_Chuyen WHERE ma_phieu_chuyen = @ma_phieu_chuyen", con))
                    {
                        cmdChiTiet.Parameters.AddWithValue("@ma_phieu_chuyen", ma_phieu_chuyen);
                        cmdChiTiet.ExecuteNonQuery();
                    }
                    
                    
                    using (SqlCommand cmd = new SqlCommand("DELETE FROM Phieu_Chuyen_Hang WHERE ma_phieu_chuyen = @ma_phieu_chuyen", con))
                    {
                        cmd.Parameters.AddWithValue("@ma_phieu_chuyen", ma_phieu_chuyen);
                        int rowsAffected = cmd.ExecuteNonQuery();
                        
                        if (rowsAffected > 0)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Xóa phiếu chuyển hàng thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không tìm thấy phiếu chuyển hàng để xóa";
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.TrangThaiCode = 500;
                response.ThongBaoLoi = ex.Message;
            }
            return JsonConvert.SerializeObject(response);
        }
    }
}
