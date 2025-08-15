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
    public class QuanLyNhapKhoController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public QuanLyNhapKhoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("getAllQuanLyNhapKho")]
        public string GetQuanLyNhapKho()
        {
            var connectionString = _configuration.GetConnectionString("QuanLyNhapKhoAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from Nhap_Kho", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<QuanLyNhapKho> quanlynhapkholist = new List<QuanLyNhapKho>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    QuanLyNhapKho quanlynhapkho = new QuanLyNhapKho();
                    quanlynhapkho.ma_nhap = Convert.ToString(dt.Rows[i]["ma_nhap"]);
                    quanlynhapkho.ma_kho = Convert.ToString(dt.Rows[i]["ma_kho"]);
                    quanlynhapkho.ma_san_pham = Convert.ToString(dt.Rows[i]["ma_san_pham"]);
                    quanlynhapkho.so_luong = Convert.ToInt32(dt.Rows[i]["so_luong"]);
                    quanlynhapkho.ngay_nhap = Convert.ToDateTime(dt.Rows[i]["ngay_nhap"]);
                    quanlynhapkho.dien_giai = Convert.ToString(dt.Rows[i]["dien_giai"]);
                    quanlynhapkholist.Add(quanlynhapkho);
                }
            }
            if (quanlynhapkholist.Count > 0)
                return JsonConvert.SerializeObject(quanlynhapkholist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }
        }
        [HttpPost]
        [Route("createQuanLyNhapKho")]
        public string createQuanLyNhapKho(QuanLyNhapKho quanLyNhapKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhapKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sThemNhapKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_san_pham", quanLyNhapKho.ma_san_pham);
                        cmd.Parameters.AddWithValue("@so_luong", quanLyNhapKho.so_luong);
                        cmd.Parameters.AddWithValue("@ngay_nhap", quanLyNhapKho.ngay_nhap);
                        cmd.Parameters.AddWithValue("@dien_giai", quanLyNhapKho.dien_giai);


                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Phiếu nhập kho đã được tạo thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể tạo phiếu nhập kho";
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
        [Route("updateQuanLyNhapKho")]
        public string updateQuanLyNhapKho(QuanLyNhapKho quanLyNhapKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhapKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sCapNhatNhapKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_nhap", quanLyNhapKho.ma_nhap);
                        cmd.Parameters.AddWithValue("@ma_san_pham", quanLyNhapKho.ma_san_pham);
                        cmd.Parameters.AddWithValue("@so_luong", quanLyNhapKho.so_luong);
                        cmd.Parameters.AddWithValue("@ngay_nhap", quanLyNhapKho.ngay_nhap);
                        cmd.Parameters.AddWithValue("@dien_giai", quanLyNhapKho.dien_giai);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Phiếu nhập kho đã được cập nhật thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể cập nhật phiếu nhập kho";
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
        [Route("deleteQuanLyNhapKho")]
        public string deleteQuanLyNhapKho(string ma_nhap)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhapKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sXoaNhapKho", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_nhap", ma_nhap);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "Phiếu nhập kho đã được xóa thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không tìm thấy phiếu nhập kho để xóa hoặc không thể xóa";
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
