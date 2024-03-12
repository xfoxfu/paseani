import { testParser } from "../testutil.js";
import { GMTeamParser } from "./GMTeamParser.js";

testParser(GMTeamParser, [
  "[GM-Team][国漫][凡人修仙传 星海飞驰][Fan Ren Xiu Xian Zhuan][2023][03][AVC][GB][1080P]",
  "[GM-Team][国漫][师兄啊师兄][My Senior Brother is Too Steady][2023][15][GB][4K HEVC 10Bit]",
  "[GM-Team][国漫][沧元图][The Demon Hunter][2023][01-26 Fin][GB][4K HEVC 10Bit]",
  "[GM-Team][国漫][沧元图][The Demon Hunter][2023][26 END][GB][4K HEVC 10Bit]",
  "[GM-Team][国漫][斗罗大陆][Dou Luo Da Lu][Douro Mainland][2023][Movie][AVC][GB][1080P]",
]);
