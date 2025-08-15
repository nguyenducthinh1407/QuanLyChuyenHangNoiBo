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
    public class QuanLyNhanVienKhoController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public QuanLyNhanVienKhoController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        [Route("getAllQuanLyNhanVienKho")]
        public string GetQuanLyNhanVienKho()
        {
            var connectionString = _configuration.GetConnectionString("QuanLyNhanVienKhoAppCon");
            SqlConnection con = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter("select * from Nhan_Vien_kho", con);
            DataTable dt = new DataTable();
            da.Fill(dt);
            List<QuanLyNhanVienKho> quanlynhanvienkholist = new List<QuanLyNhanVienKho>();
            Response response = new Response();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    QuanLyNhanVienKho quanlynhanvienkho = new QuanLyNhanVienKho();
                    quanlynhanvienkho.ma_nv = Convert.ToString(dt.Rows[i]["ma_nv"]);
                    quanlynhanvienkho.ho_ten = Convert.ToString(dt.Rows[i]["ho_ten"]);
                    quanlynhanvienkho.vai_tro = Convert.ToString(dt.Rows[i]["vai_tro"]);
                    quanlynhanvienkho.email = Convert.ToString(dt.Rows[i]["email"]);
                    quanlynhanvienkho.so_dien_thoai = Convert.ToString(dt.Rows[i]["so_dien_thoai"]);
                    quanlynhanvienkho.dia_chi = Convert.ToString(dt.Rows[i]["dia_chi"]);
                    quanlynhanvienkholist.Add(quanlynhanvienkho);
                }
            }
            if (quanlynhanvienkholist.Count > 0)
                return JsonConvert.SerializeObject(quanlynhanvienkholist);
            else
            {
                response.TrangThaiCode = 100;
                response.ThongBaoLoi = "Không tìm thấy dữ liệu ";
                return JsonConvert.SerializeObject(response);
            }
        }
        [HttpPost]
        [Route("createQuanLyNhanVienKho")]
        public string createQuanLyNhanVienKho(QuanLyNhanVienKho quanLyNhanVienKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhanVienKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sThemnhanvien", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ho_ten", quanLyNhanVienKho.ho_ten);
                        cmd.Parameters.AddWithValue("@vai_tro", quanLyNhanVienKho.vai_tro);
                        cmd.Parameters.AddWithValue("@email", quanLyNhanVienKho.email);
                        cmd.Parameters.AddWithValue("@so_dien_thoai", quanLyNhanVienKho.so_dien_thoai);
                        cmd.Parameters.AddWithValue("@dia_chi", quanLyNhanVienKho.dia_chi);


                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "nhân viên kho đã được tạo thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể tạo nhân viên kho";
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
        [Route("updateQuanLyNhanVienKho")]
        public string updateQuanLyNhanVienKho(QuanLyNhanVienKho quanLyNhanVienKho)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhanVienKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sCapnhatnhanvien", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_nv", quanLyNhanVienKho.ma_nv);
                        cmd.Parameters.AddWithValue("@ho_ten", quanLyNhanVienKho.ho_ten);
                        cmd.Parameters.AddWithValue("@vai_tro", quanLyNhanVienKho.vai_tro);
                        cmd.Parameters.AddWithValue("@email", quanLyNhanVienKho.email);
                        cmd.Parameters.AddWithValue("@so_dien_thoai", quanLyNhanVienKho.so_dien_thoai);
                        cmd.Parameters.AddWithValue("@dia_chi", quanLyNhanVienKho.dia_chi);


                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "nhân viên kho đã được cập nhật thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể cập nhật nhân viên kho";
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
        [Route("deleteQuanLyNhanVienKho")]
        public string deleteQuanLyNhanVienKho(string ma_nv)
        {
            Response response = new Response();
            try
            {
                var connectionString = _configuration.GetConnectionString("QuanLyNhanVienKhoAppCon");
                using (SqlConnection con = new SqlConnection(connectionString))
                {
                    con.Open();

                    using (SqlCommand cmd = new SqlCommand("sXoanhanvien", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@ma_nv", ma_nv);

                        SqlParameter retParam = new SqlParameter("@ret", SqlDbType.Bit);
                        retParam.Direction = ParameterDirection.Output;
                        cmd.Parameters.Add(retParam);

                        cmd.ExecuteNonQuery();

                        bool result = (bool)retParam.Value;

                        if (result)
                        {
                            response.TrangThaiCode = 200;
                            response.ThongBaoLoi = "nhân viên kho đã được xóa thành công";
                        }
                        else
                        {
                            response.TrangThaiCode = 100;
                            response.ThongBaoLoi = "Không thể xóa nhân viên kho";
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
