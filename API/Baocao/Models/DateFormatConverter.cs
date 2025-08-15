using System;
using System.Globalization;
using Newtonsoft.Json;

namespace Baocao.Models
{
    public class DateFormatConverter : Newtonsoft.Json.JsonConverter<DateTime>
    {
        private readonly string _format;

        public DateFormatConverter(string format)
        {
            _format = format;
        }

        public override DateTime ReadJson(Newtonsoft.Json.JsonReader reader, Type objectType, DateTime existingValue, bool hasExistingValue, Newtonsoft.Json.JsonSerializer serializer)
        {
            if (reader.TokenType == Newtonsoft.Json.JsonToken.Null)
                return default(DateTime);

            var value = reader.Value?.ToString();
            if (string.IsNullOrEmpty(value))
                return default(DateTime);

            return DateTime.ParseExact(value, _format, CultureInfo.InvariantCulture);
        }

        public override void WriteJson(Newtonsoft.Json.JsonWriter writer, DateTime value, Newtonsoft.Json.JsonSerializer serializer)
        {
            writer.WriteValue(value.ToString(_format, CultureInfo.InvariantCulture));
        }
    }
}