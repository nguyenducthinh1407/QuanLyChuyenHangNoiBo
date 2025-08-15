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
    public class QuanLySanPhamController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public QuanLySanPhamController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("getAllQuanLySanPham")]
        public string GetQuanLySanPham()
        {
            var connectionString = _configuration.GetConnectionString("QuanLySanPhamAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from San_Pham", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<QuanLySanPham> quanlysanphamlist = new List<QuanLySanPham>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    QuanLySanPham quanlysanpham = new QuanLySanPham();
                    quanlysanpham.ma_sp = Convert.ToString(dt.Rows[i]["ma_san_pham"]);
                    quanlysanpham.ten_sp = Convert.ToString(dt.Rows[i]["ten_san_pham"]);
                    quanlysanpham.ma_loaisp = Convert.ToInt32(dt.Rows[i]["ma_loaiSP"]);
                    quanlysanpham.don_vi_tinh = Convert.ToString(dt.Rows[i]["don_vi_tinh"]);
                    quanlysanpham.don_gia_ban = Convert.ToDecimal(dt.Rows[i]["don_gia_ban"]);
                    quanlysanpham.so_luong_ton_kho = Convert.ToInt32(dt.Rows[i]["so_luong_ton_kho"]);
                    quanlysanpham.don_gia_nhap = Convert.ToDecimal(dt.Rows[i]["don_gia_nhap"]);
                    quanlysanphamlist.Add(quanlysanpham);
                }
            }
            if (quanlysanphamlist.Count > 0)
                return JsonConvert.SerializeObject(quanlysanphamlist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }
        }

        [HttpPost]
        [Route("createQuanLySanPham")]
        public string createQuanLySanPham(QuanLySanPham quanLySanPham)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLySanPhamAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();
                    
                    using (SqlCommand cmd = new SqlCommand("sThemSanPham", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ten_san_pham", quanLySanPham.ten_sp);
                        cmd.Parameters.AddWithValue("@ma_loaiSP", quanLySanPham.ma_loaisp);
                        cmd.Parameters.AddWithValue("@don_vi_tinh", quanLySanPham.don_vi_tinh);
                        cmd.Parameters.AddWithValue("@don_gia_ban", quanLySanPham.don_gia_ban);
                        cmd.Parameters.AddWithValue("@so_luong_ton_kho", quanLySanPham.so_luong_ton_kho);
                        cmd.Parameters.AddWithValue("@don_gia_nhap", quanLySanPham.don_gia_nhap);


                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Sản phẩm đã được tạo thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể tạo sản phẩm";
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
        [Route("updateQuanLySanPham")]
        public string UpdateQuanLySanPham(QuanLySanPham quanLySanPham)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLySanPhamAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sCapNhatSanPham", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_san_pham", quanLySanPham.ma_sp);
                        cmd.Parameters.AddWithValue("@ten_san_pham", quanLySanPham.ten_sp);
                        cmd.Parameters.AddWithValue("@ma_loaiSP", quanLySanPham.ma_loaisp);
                        cmd.Parameters.AddWithValue("@don_vi_tinh", quanLySanPham.don_vi_tinh);
                        cmd.Parameters.AddWithValue("@don_gia_ban", quanLySanPham.don_gia_ban);
                        cmd.Parameters.AddWithValue("@so_luong_ton_kho", quanLySanPham.so_luong_ton_kho);
                        cmd.Parameters.AddWithValue("@don_gia_nhap", quanLySanPham.don_gia_nhap);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Sản phẩm đã được cập nhật thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể cập nhật sản phẩm";
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
        [Route("deleteQuanLySanPham")]
        public string DeleteQuanLySanPham(string ma_sp)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLySanPhamAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sXoaSanPham", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_san_pham", ma_sp);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Sản phẩm đã được xóa thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể xóa sản phẩm";
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
