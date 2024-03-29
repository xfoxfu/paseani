import { TagType } from "../parser/index.js";
import { normalize } from "../util.js";
import { RawDatabase } from "./RawDatabase.js";
import { Data } from "./index.js";

export const prefixdb: Record<string, [TagType, string] | null> = {
  "1080p": [TagType.resolution, "1080p"],
  "mp4": [TagType.file_type, "mp4"],
  "aac": [TagType.audio_type, "aac"],
  "720p": [TagType.resolution, "720p"],
  "avc": [TagType.video_type, "h264"],
  "hevc": [TagType.video_type, "h265"],
  "gb": [TagType.subtitle_language, "zh-hans"],
  "cht": [TagType.subtitle_language, "zh-hant"],
  "chtsrt": [TagType.subtitle_language, "zh-hant"],
  "mkv": [TagType.file_type, "mkv"],
  "web-dl": [TagType.source_type, "WEB-DL"],
  "繁体": [TagType.subtitle_language, "zh-hant"],
  "big5": [TagType.subtitle_language, "zh-hant"],
  "baha": [TagType.source_team, "Baha"],
  "喵萌奶茶屋": [TagType.team, "喵萌奶茶屋"],
  "简体": [TagType.subtitle_language, "zh-hans"],
  "webrip": [TagType.source_type, "WebRip"],
  "x264": [TagType.video_type, "h264"],
  "nc-raws": [TagType.team, "NC-Raws"],
  "10bit": [TagType.video_type, "10-bit"],
  "桜都字幕组": [TagType.team, "桜都字幕组"],
  "动漫国字幕组": [TagType.team, "动漫国字幕组"],
  "lilith-raws": [TagType.team, "Lilith-Raws"],
  "国漫": [TagType.team, "国漫"],
  "lolihouse": [TagType.team, "LoliHouse"],
  "极影字幕社": [TagType.team, "极影字幕社"],
  "招募翻译校对": null,
  "b-global": [TagType.source_team, "Bilibili-Global"],
  "b-global donghua": [TagType.source_team, "Bilibili-Global"],
  "bdrip": [TagType.source_type, "BDRip"],
  "chs": [TagType.subtitle_language, "zh-hans"],
  "悠哈璃羽字幕社": [TagType.team, "悠哈璃羽字幕社"],
  "招募翻译": null,
  "c.c动漫": [TagType.team, "c.c动漫"],
  "千夏字幕组": [TagType.team, "千夏字幕组"],
  "ani": [TagType.team, "Ani"],
  "gj.y": [TagType.team, "NC-Raws"],
  "简日双语": [TagType.subtitle_language, "zh-hans|ja"],
  "简繁内封字幕": [TagType.subtitle_language, "zh-hans|zh-hant"],
  "繁日双语": [TagType.subtitle_language, "zh-hant|ja"],
  "cr": [TagType.source_team, "CrunchyRoll"],
  "诸神字幕组": [TagType.team, "诸神字幕组"],
  ".mp4": [TagType.file_type, "mp4"],
  "幻樱字幕组": [TagType.team, "幻樱字幕组"],
  "漫猫字幕组": [TagType.team, "漫猫字幕组"],
  "1280x720": [TagType.resolution, "720p"],
  "简体内嵌": [TagType.subtitle_language, "zh-hans"],
  "gm-team": [TagType.team, "国漫"],
  "end": null,
  "字幕社招人内详": null,
  "leopard-raws": [TagType.team, "Leopard-Raws"],
  "星空字幕组": [TagType.team, "星空字幕组"],
  "繁体内嵌": [TagType.subtitle_language, "zh-hant"],
  "网盘": null,
  "简繁内封": [TagType.subtitle_language, "zh-hans|zh-hant"],
  "豌豆字幕组": [TagType.team, "豌豆字幕组"],
  "爱恋": [TagType.team, "爱恋"],
  "爱恋字幕社": [TagType.team, "爱恋"],
  "srt": null,
  "dhr动研字幕组": [TagType.team, "DHR动研字幕组"],
  "繁中": [TagType.subtitle_language, "zh-hant"],
  "简中": [TagType.subtitle_language, "zh-hans"],
  "flac": [TagType.audio_type, "flac"],
  "搬运": null,
  "风之圣殿字幕组": [TagType.team, "风之圣殿字幕组"],
  "喵萌茶会字幕组": [TagType.team, "喵萌茶会字幕组"],
  "fin": null,
  "幻之字幕组": [TagType.team, "幻之字幕组"],
  "简日内嵌": [TagType.subtitle_language, "zh-hans|ja"],
  "合集": null,
  "简繁外挂": [TagType.subtitle_language, "zh-hans|zh-hant"],
  "8bit": [TagType.video_type, "8-bit"],
  "bilibili": [TagType.source_team, "Bilibili"],
  "简日": [TagType.subtitle_language, "zh-hans|ja"],
  "轻之国度字幕组": [TagType.team, "轻之国度字幕组"],
  "bd": [TagType.source_type, "BDMV"],
  "angelecho": [TagType.team, "AngelEcho"],
  "vcb-studio": [TagType.team, "VCB-Studio"],
  "vcb-s": [TagType.team, "VCB-Studio"],
  "西农yui汉化组": [TagType.team, "西农yui汉化组"],
  "sweetsub": [TagType.team, "SweetSub"],
  "茉语星梦": [TagType.team, "茉语星梦"],
  "简繁日内封字幕": [TagType.subtitle_language, "zh-hans|zh-hant|ja"],
  "简繁外挂字幕": [TagType.subtitle_language, "zh-hans|zh-hant"],
  "bangumi.online": [TagType.team, "bangumi.online"],
  "八重樱字幕组": [TagType.team, "八重樱字幕组"],
  "繁日内嵌": [TagType.subtitle_language, "zh-hant|ja"],
  "bahamut": [TagType.source_team, "Baha"],
  "神楽坂 まひろ": [TagType.team, "NC-Raws"],
  "jibaketa合成": [TagType.team, "jibaketa"],
  "漫猫字幕社": [TagType.team, "漫猫字幕社"],
  "简体中文字幕": [TagType.subtitle_language, "zh-hans"],
  "sentai": [TagType.source_team, "Sentai"],
  "ohys-raws": [TagType.team, "Ohys-Raws"],
  "nan-raws": [TagType.team, "NaN-Raws"],
  "raw": [TagType.source_type, "RAW"],
  "eggpain-raws": [TagType.team, "EggPain-Raws"],
  "sfeo-raws": [TagType.team, "SFEO-Raws"],
  "emtp-raws": [TagType.team, "EMTP-Raws"],
  "ank-raws": [TagType.team, "ANK-Raws"],
  "dhr-raws": [TagType.team, "DHR-Raws"],
  "肥羊-raws": [TagType.team, "肥羊-Raws"],
  "erai-raws": [TagType.team, "Erai-raws"],
  "lowpower-raws": [TagType.team, "LowPower-Raws"],
  "web": [TagType.source_type, "WEB-DL"],
  "jp": [TagType.subtitle_language, "ja"],
  "简日双语字幕": [TagType.subtitle_language, "zh-hans|ja"],
  "1920x1080": [TagType.resolution, "1080p"],
  "仅限港澳台地区": null,
  "百度网盘": null,
  "dhr百合组": [TagType.team, "DHR动研字幕组"],
  "eng": [TagType.subtitle_language, "en"],
  "简中内嵌": [TagType.subtitle_language, "zh-hans"],
  "异域字幕组": [TagType.team, "异域字幕组"],
  "简繁日内封": [TagType.team, "zh-hans|zh-hant|ja"],
  "漫游字幕组": [TagType.team, "漫游字幕组"],
  "tbs": [TagType.source_team, "TBS"],
  "时雨初空": [TagType.team, "时雨初空"],
  "rh字幕组": [TagType.team, "rh字幕组"],
  "yuv420p10": [TagType.video_type, "YUV420P10"],
  "gb简体": [TagType.subtitle_language, "zh-hans"],
  "dymy字幕组": [TagType.team, "dymy字幕组"],
  "傲娇零字幕组": [TagType.team, "傲娇零字幕组"],
  "multiple subtitle": [TagType.subtitle_language, "unk"],
  "喵萌production": [TagType.source_team, "喵萌奶茶屋"],
  "繁": [TagType.subtitle_language, "zh-hant"],
  "big5繁体": [TagType.subtitle_language, "zh-hant"],
  "囧夏字幕组": [TagType.team, "囧夏字幕组"],
  "wolf字幕组": [TagType.team, "wolf字幕组"],
  "澄空学园": [TagType.team, "澄空学园"],
  "新人招募": null,
  "新人招募中": null,
  "中日双语字幕": [TagType.subtitle_language, "zh-hans|ja"],
  "hkacg搬运组": [TagType.team, "HKACG搬运组"],
  "粤日双语+内封繁体中文字幕": [TagType.subtitle_language, "zh-hant"],
  "织梦字幕组": [TagType.team, "织梦字幕组"],
  "猎户不鸽压制": [TagType.team, "猎户"],
  "tucaptions": [TagType.team, "TUCaptions"],
  "cn": [TagType.subtitle_language, "zh"],
  "简繁日语字幕": [TagType.subtitle_language, "zh-hans|zh-hant|ja"],
  "北宇治字幕组": [TagType.team, "北宇治字幕组"],
  "丸子家族": [TagType.team, "丸子家族"],
  "雪飘工作室": [TagType.team, "雪飘工作室"],
  "tvb粤语": [TagType.source_team, "TVB粤语"],
  "x265": [TagType.video_type, "h265"],
  "movie": null,
  "ma10p": [TagType.video_type, "h265|10-bit"],
  "webdl": [TagType.source_type, "WEB-DL"],
  "繁体中文字幕": [TagType.subtitle_language, "zh-hant"],
  "ova": null,
  "风车字幕组": [TagType.team, "风车字幕组"],
  "字幕组招人内详": null,
  "猪猪日剧字幕组": [TagType.team, "猪猪日剧字幕组"],
  "离谱sub": [TagType.team, "离谱Sub"],
  "酷漫404": [TagType.team, "酷漫404"],
  "uha-wings": [TagType.team, "悠哈璃羽字幕社"],
  "bs11": [TagType.source_team, "BS-11"],
  "1080p+": [TagType.resolution, "1080p"],
  "脸肿字幕组": [TagType.team, "脸肿字幕组"],
  "tvrip": [TagType.source_type, "TVRip"],
  "dmhy": [TagType.team, "dmhy"],
  "简繁日文字幕": [TagType.subtitle_language, "zh-hans|zh-hant|ja"],
  "紫音字幕组": [TagType.team, "紫音字幕组"],
  "完": null,
  "猫恋汉化组": [TagType.team, "猫恋汉化组"],
  "简繁内挂": [TagType.team, "zh-hans|zh-hant"],
  "@60fps": [TagType.resolution, "60fps"],
  "2160p": [TagType.resolution, "4k"],
  "4k": [TagType.resolution, "4k"],
  "mce汉化组": [TagType.team, "MCE汉化组"],
  "日剧": null,
  "波子汽水汉化组": [TagType.team, "波子汽水汉化组"],
  "kna字幕组": [TagType.team, "KNA字幕组"],
  "hkacg字幕组": [TagType.team, "HKACG字幕组"],
  "华盟字幕社": [TagType.team, "华盟字幕社"],
  "猎户手抄部": [TagType.team, "猎户"],
  "压制": null,
  "ymdr搬运组": [TagType.team, "YMDR搬运组"],
  "人员招募": null,
  "外挂gb": [TagType.subtitle_language, "zh-hant"],
  "繁体外挂": [TagType.subtitle_language, "zh-hant"],
  "修正合集": null,
  "霜庭云花sub": [TagType.team, "霜庭云花Sub"],
  "中日双语": [TagType.subtitle_language, "zh|ja"],
  "7³acg": [TagType.team, "7³ACG"],
  "爱恋字幕组": [TagType.team, "爱恋"],
  "风之圣殿": [TagType.team, "风之圣殿字幕组"],
  "全集": null,
  "中文字幕": [TagType.subtitle_language, "zh"],
  "招募新人": null,
  "web版": [TagType.source_type, "WEB-DL"],
  "猎户不鸽发布组": [TagType.team, "猎户"],
  "漫猫": [TagType.team, "漫猫"],
  "铃风字幕组": [TagType.team, "铃风字幕组"],
  "天行搬运": [TagType.team, "天行搬运"],
  "届恋字幕组": [TagType.team, "届恋字幕组"],
  "hevc10": [TagType.video_type, "h265|10-bit"],
  "atx": [TagType.source_team, "ATX"],
  "10-bit": [TagType.video_type, "10-bit"],
  "8-bit": [TagType.video_type, "8-bit"],
  "3840x2160": [TagType.resolution, "4k"],
  "opus": [TagType.audio_type, "opus"],
  "hevc-10bit": [TagType.video_type, "h265|10-bit"],
  "chs_cht_eng_th_srt": [TagType.subtitle_language, "zh-hans|zh-hant|en|th"],
  "chs_cht_th_srt": [TagType.subtitle_language, "zh-hans|zh-hant|th"],
  "tvb": [TagType.source_team, "TVB"],
  "viutv": [TagType.source_team, "ViuTV"],
  "viutv粵语": [TagType.source_team, "ViuTV"],
  "简繁字幕": [TagType.subtitle_language, "zh-hans|zh-hant"],
  "v2": null,
  "skymoon-raws": [TagType.team, "Skymoon-Raws"],
  "天月搬运组": [TagType.team, "天月搬运组"],
  "天月字幕组": [TagType.team, "天月字幕组"],
  "❀拨雪寻春❀": [TagType.team, "❀拨雪寻春❀"],
  "云光字幕组": [TagType.team, "云光字幕组"],
  "猎户压制部": [TagType.team, "猎户"],
  "Amor字幕组": [TagType.team, "Amor"],
  "简日字幕": [TagType.subtitle_language, "zh-hans|ja"],
  "繁日字幕": [TagType.subtitle_language, "zh-hant|ja"],
};

export class PrefixDatabase extends RawDatabase {
  public override name = "PrefixDatabase";

  // eslint-disable-next-line @typescript-eslint/require-await
  public override async *list(): AsyncIterable<Data> {
    for (const [key, operation] of Object.entries(prefixdb)) {
      yield {
        name: normalize(key),
        type: operation?.[0] ?? TagType.unknown,
        stdName: operation?.[1]?.split("|") ?? [],
      };
    }
  }
}
