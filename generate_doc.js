const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        PageBreak, PageNumber } = require('docx');
const fs = require('fs');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(text, width, shading = null) {
    return new TableCell({
        borders,
        width: { size: width, type: WidthType.DXA },
        shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun(text)] })]
    });
}

function headerCell(text, width) {
    return cell(text, width, "D5E8F0");
}

const doc = new Document({
    styles: {
        default: { document: { run: { font: "Arial", size: 24 } } },
        paragraphStyles: [
            { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 48, bold: true, font: "Arial" },
              paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
            { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 36, bold: true, font: "Arial" },
              paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 1 } },
            { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
              run: { size: 28, bold: true, font: "Arial" },
              paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
        },
        children: [
            // 封面
            new Paragraph({ spacing: { before: 2000 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "KOC AI增长助手", bold: true, size: 72, font: "Arial" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 400 },
                children: [new TextRun({ text: "腾讯PCG校园AI产品创意大赛", size: 36, font: "Arial", color: "666666" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 200 },
                children: [new TextRun({ text: "赛道⑤ - PCG技术线-智能营销/AI小游戏方向", size: 28, font: "Arial", color: "888888" })]
            }),
            new Paragraph({ spacing: { before: 1500 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "参赛说明文档", bold: true, size: 40, font: "Arial" })]
            }),
            new Paragraph({ spacing: { before: 800 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "最后更新时间：2026年5月6日", size: 24, font: "Arial", color: "888888" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "文档版本：v2.0（提交版）", size: 24, font: "Arial", color: "888888" })]
            }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 一、产品概述
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、产品概述")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 参赛信息")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({ children: [headerCell("项目", 2500), headerCell("内容", 6526)] }),
                    new TableRow({ children: [cell("参赛赛道", 2500), cell("赛道⑤ - PCG技术线-智能营销/AI小游戏方向", 6526)] }),
                    new TableRow({ children: [cell("作品名称", 2500), cell("KOC AI增长助手", 6526)] }),
                    new TableRow({ children: [cell("产品类型", 2500), cell("面向KOC的社媒AI Agent", 6526)] }),
                    new TableRow({ children: [cell("核心技术", 2500), cell("大语言模型（LLM）+ LangGraph Agent + 社交媒体数据分析", 6526)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("1.2 一句话介绍")] }),
            new Paragraph({
                spacing: { before: 120 },
                children: [new TextRun({ text: "KOC AI增长助手：让每个普通人都能轻松玩转社交媒体，通过AI提供账号诊断、智能选题、内容创作、互动优化等一站式服务。", italics: true })]
            }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 二、需求背景
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、需求背景")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 市场痛点")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 3500, 3526],
                rows: [
                    new TableRow({ children: [headerCell("痛点", 2000), headerCell("描述", 3500), headerCell("影响", 3526)] }),
                    new TableRow({ children: [cell("内容定位模糊", 2000), cell("不知道自己适合做什么方向，难以形成独特风格", 3500), cell("内容散乱，粉丝粘性低", 3526)] }),
                    new TableRow({ children: [cell("选题低效", 2000), cell("花费大量时间思考拍什么，选题靠碰运气", 3500), cell("创作效率低，更新不稳定", 3526)] }),
                    new TableRow({ children: [cell("运营不专业", 2000), cell("不懂平台算法、发布时间、互动技巧", 3500), cell("流量获取困难", 3526)] }),
                    new TableRow({ children: [cell("涨粉困难", 2000), cell("缺乏系统性的成长路径和策略", 3500), cell("账号发展缓慢", 3526)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("2.2 目标用户")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: "初级KOC：", bold: true }), new TextRun("粉丝数 < 1万，内容创作经验不足")]}),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "转型KOC：", bold: true }), new TextRun("从其他行业转向社交媒体，需要快速上手")]}),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "副业KOC：", bold: true }), new TextRun("利用业余时间运营账号，需要高效工具")]}),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 三、产品介绍
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、产品介绍")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 产品定位")] }),
            new Paragraph({
                spacing: { before: 120 },
                children: [new TextRun("KOC AI增长助手是一款面向普通KOC的社媒AI Agent，通过AI能力提供内容方向、选题建议、发布策略、互动优化、AI小游戏等服务，帮助其低成本、高效率实现账号成长。")]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("3.2 核心价值主张")] }),
            new Paragraph({
                spacing: { before: 120 },
                children: [new TextRun({ text: "\"让每个普通人都能轻松玩转社交媒体\"", bold: true, italics: true })]
            }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: "AI驱动：", bold: true }), new TextRun("集成大语言模型，提供智能化服务")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "一站式：", bold: true }), new TextRun("覆盖账号运营全流程")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "低成本：", bold: true }), new TextRun("无需专业团队，个人即可使用")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "高效率：", bold: true }), new TextRun("AI辅助决策，大幅提升运营效率")] }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 四、核心功能
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、核心功能")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 功能架构")] }),
            new Paragraph({
                spacing: { before: 120 },
                shading: { fill: "F5F5F5", type: ShadingType.CLEAR },
                border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6" }, left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6" }, right: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6" } },
                children: [
                    new TextRun({ text: "KOC AI增长助手包含六大核心模块：AI账号诊断、智能选题引擎、内容创作助手、AI小游戏生成、数据看板、成长路径规划。", font: "Arial", size: 24 })
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("4.2 功能详解")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun("4.2.1 AI账号诊断")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("用户输入账号名称和简介后，AI深度分析账号定位与内容策略，输出内容包括：")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("1. 账号定位分析 - 当前定位评估、优势分析、改进建议")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("2. 内容策略规划 - 内容矩阵建议、发布频率、最佳发布时间")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("3. 受众画像分析 - 核心受众特征、受众需求洞察、兴趣标签")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("4. 30天涨粉计划 - 每周具体行动项、关键里程碑、目标指标")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("5. 账号健康度评分 - 综合评分（0-100）、各维度雷达图")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240 }, children: [new TextRun("4.2.2 智能选题引擎")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("基于内容赛道和创意程度，AI生成个性化选题建议。")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "输入参数：", bold: true }), new TextRun("内容赛道（8大分类）、创意程度（3级）、选题数量（3-10个）")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: "输出内容：", bold: true }), new TextRun("选题标题+描述、难度等级、相关标签、今日热点结合")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240 }, children: [new TextRun("4.2.3 内容创作助手")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1800, 3000, 4226],
                rows: [
                    new TableRow({ children: [headerCell("工具", 1800), headerCell("输入", 3000), headerCell("输出", 4226)] }),
                    new TableRow({ children: [cell("视频脚本生成", 1800), cell("视频主题、时长、风格", 3000), cell("完整分镜脚本（开头吸睛→核心价值→互动引导→结尾升华）", 4226)] }),
                    new TableRow({ children: [cell("标题优化", 1800), cell("内容主题、目标平台", 3000), cell("5-10个备选标题 + 吸引力评分", 4226)] }),
                    new TableRow({ children: [cell("文案生成", 1800), cell("内容主题", 3000), cell("完整社交媒体文案", 4226)] }),
                    new TableRow({ children: [cell("封面建议", 1800), cell("视频主题", 3000), cell("封面设计建议（视觉/文字/色彩/元素）", 4226)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240 }, children: [new TextRun("4.2.4 AI小游戏生成（赛道核心功能）")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("基于游戏主题和类型，AI一键生成完整的小游戏设计方案，包含规则、分享机制、视觉素材建议。")] }),
            new Paragraph({ spacing: { before: 120 }, children: [new TextRun({ text: "输入参数：", bold: true })] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("游戏主题：用户自定义（如：测测你的反应速度）")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("游戏类型：挑战类、知识问答类、互动测试类、抽奖类")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("时长要求：5-30秒")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("风格：欢乐有趣、酷炫潮流、可爱清新")] }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 五、技术架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("五、技术架构")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 技术栈")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1500, 2000, 5526],
                rows: [
                    new TableRow({ children: [headerCell("层级", 1500), headerCell("技术选型", 2000), headerCell("说明", 5526)] }),
                    new TableRow({ children: [cell("前端框架", 1500), cell("HTML5 + CSS3 + JS", 2000), cell("单页应用，无框架依赖", 5526)] }),
                    new TableRow({ children: [cell("后端框架", 1500), cell("FastAPI", 2000), cell("高性能异步API框架", 5526)] }),
                    new TableRow({ children: [cell("Agent框架", 1500), cell("LangGraph", 2000), cell("状态机驱动的Agent编排", 5526)] }),
                    new TableRow({ children: [cell("AI集成", 1500), cell("OpenAI兼容API", 2000), cell("支持混元、DeepSeek、Claude等", 5526)] }),
                    new TableRow({ children: [cell("数据验证", 1500), cell("Pydantic", 2000), cell("请求/响应模型定义", 5526)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("5.2 核心API端点")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 1500, 4526],
                rows: [
                    new TableRow({ children: [headerCell("端点", 3000), headerCell("方法", 1500), headerCell("说明", 4526)] }),
                    new TableRow({ children: [cell("/api/diagnosis", 3000), cell("POST", 1500), cell("AI账号诊断", 4526)] }),
                    new TableRow({ children: [cell("/api/topics", 3000), cell("POST", 1500), cell("智能选题生成", 4526)] }),
                    new TableRow({ children: [cell("/api/content", 3000), cell("POST", 1500), cell("内容创作（脚本/标题/文案/封面）", 4526)] }),
                    new TableRow({ children: [cell("/api/game", 3000), cell("POST", 1500), cell("AI小游戏生成", 4526)] }),
                    new TableRow({ children: [cell("/api/test", 3000), cell("POST", 1500), cell("API连接测试", 4526)] }),
                ]
            }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 六、产品亮点
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("六、产品亮点")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 核心创新点")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({ children: [headerCell("亮点", 2500), headerCell("说明", 6526)] }),
                    new TableRow({ children: [cell("开放API架构", 2500), cell("支持用户使用自己的API Key，接入任意OpenAI兼容模型", 6526)] }),
                    new TableRow({ children: [cell("LangGraph Agent", 2500), cell("状态机驱动的Agent编排，可扩展性强", 6526)] }),
                    new TableRow({ children: [cell("纯前端实现", 2500), cell("无需复杂后端，降低部署成本", 6526)] }),
                    new TableRow({ children: [cell("一站式服务", 2500), cell("覆盖账号运营全流程，无需切换多工具", 6526)] }),
                    new TableRow({ children: [cell("AI小游戏集成", 2500), cell("结合赛道方向，支持一键生成互动小游戏", 6526)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("6.2 与PCG业务结合")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("可集成视频号API，直接发布内容")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("可接入腾讯广告智能投放平台")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("可结合AIGC能力自动生成广告素材")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: "可结合AI小游戏实现用户增长和品牌传播", bold: true })] }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 七、商业模式
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("七、商业模式")] }),
            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 定价策略")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1500, 1500, 6026],
                rows: [
                    new TableRow({ children: [headerCell("版本", 1500), headerCell("价格", 1500), headerCell("功能权益", 6026)] }),
                    new TableRow({ children: [cell("Free", 1500), cell("免费", 1500), cell("基础API配置，每周10次诊断，20个选题，基础看板", 6026)] }),
                    new TableRow({ children: [cell("Pro", 1500), cell("¥99/月", 1500), cell("无限AI调用，高级数据分析，多账号管理，AI小游戏无限生成", 6026)] }),
                    new TableRow({ children: [cell("Enterprise", 1500), cell("定制", 1500), cell("私有化部署，自定义模型，API批量调用", 6026)] }),
                ]
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun("7.2 变现路径")] }),
            new Paragraph({ spacing: { before: 80 }, children: [new TextRun("1. 订阅制：月费/年费订阅")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("2. 增值服务：高级功能单独收费（如AI小游戏模板）")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("3. 企业版：为企业客户提供定制服务")] }),
            new Paragraph({ spacing: { before: 40 }, children: [new TextRun("4. 生态合作：与MCN机构、品牌合作")] }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 八、未来规划
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("八、未来规划")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1500, 2000, 5526],
                rows: [
                    new TableRow({ children: [headerCell("阶段", 1500), headerCell("时间", 2000), headerCell("目标", 5526)] }),
                    new TableRow({ children: [cell("Phase 1", 1500), cell("当前", 2000), cell("完成Demo版，验证核心功能（诊断/选题/创作/游戏）", 5526)] }),
                    new TableRow({ children: [cell("Phase 2", 1500), cell("1-2月", 2000), cell("接入真实数据源（视频号API），优化AI模型", 5526)] }),
                    new TableRow({ children: [cell("Phase 3", 1500), cell("3-6月", 2000), cell("推出AI小游戏编辑器，支持自定义规则和品牌元素", 5526)] }),
                    new TableRow({ children: [cell("Phase 4", 1500), cell("6-12月", 2000), cell("商业化探索，接入品牌合作，建立KOC增长生态", 5526)] }),
                ]
            }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 九、参赛材料清单
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("九、参赛材料清单")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 4000, 2026],
                rows: [
                    new TableRow({ children: [headerCell("材料", 3000), headerCell("说明", 4000), headerCell("状态", 2026)] }),
                    new TableRow({ children: [cell("产品Demo", 3000), cell("Web端交互演示（前后端联调版本）", 4000), cell("已完成", 2026)] }),
                    new TableRow({ children: [cell("产品录屏", 3000), cell("3分钟功能演示视频", 4000), cell("待录制", 2026)] }),
                    new TableRow({ children: [cell("说明文档", 3000), cell("本文档", 4000), cell("已完成", 2026)] }),
                ]
            }),

            // 分页
            new Paragraph({ children: [new PageBreak()] }),

            // 十、团队信息
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("十、团队信息")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({ children: [headerCell("项目", 2500), headerCell("内容", 6526)] }),
                    new TableRow({ children: [cell("参赛赛道", 2500), cell("赛道⑤ - PCG技术线-智能营销/AI小游戏方向", 6526)] }),
                    new TableRow({ children: [cell("作品名称", 2500), cell("KOC AI增长助手", 6526)] }),
                    new TableRow({ children: [cell("技术栈", 2500), cell("前端：HTML5+CSS3+JS；后端：FastAPI+LangGraph", 6526)] }),
                    new TableRow({ children: [cell("Demo访问", 2500), cell("本地：http://localhost:8080（前端）+ http://localhost:8000（后端API）", 6526)] }),
                ]
            }),

            // 结尾
            new Paragraph({ spacing: { before: 800 } }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "— 文档结束 —", color: "888888", size: 24 })]
            }),
        ]
    }]
});

Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("D:/WorkBuddy/koc-ai-demo/KOC_AI增长助手_说明文档.docx", buffer);
    console.log('文档生成成功！');
});
