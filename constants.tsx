import { SlideContent, SlideType } from './types';
import { 
  Music, 
  Mic2, 
  Cpu, 
  Database, 
  Layers, 
  Search, 
  Terminal, 
  AlertTriangle,
  BarChart2,
  Settings,
  Code,
  FileAudio
} from 'lucide-react';

export const SLIDES: SlideContent[] = [
  {
    id: 1,
    type: SlideType.TITLE,
    title: "基于 RVC + RMVPE + FAISS 检索增强的 AI 翻唱系统",
    subtitle: "纯 Linux CLI 环境下的端到端歌声转换实验报告",
    content: [
      "实现高保真、低延迟的歌声转换 (Singing Voice Conversion)",
      "集成 HuBERT 内容表征与 RMVPE 鲁棒基频提取",
      "利用 FAISS 向量检索解决音色漂移问题"
    ]
  },
  {
    id: 2,
    type: SlideType.TWO_COLUMN,
    title: "1. 引言与背景",
    subtitle: "任务定义：为何歌声转换 (SVC) 比语音转换 (VC) 更具挑战性？",
    columns: {
      left: {
        title: "SVC 的特殊挑战",
        items: [
          "音域跨度极大：需处理跨八度跳跃、真假声转换及高频泛音。",
          "动态范围广：包含颤音 (Vibrato)、滑音 (Glissando) 及强弱气息变化。",
          "非平稳性强：元音长发音与快速辅音切换导致频谱结构剧烈变动。",
          "混音干扰严峻：输入源常伴随混响、伴奏残留，严重影响特征提取精度。"
        ]
      },
      right: {
        title: "系统设计动机",
        items: [
          "去混响与分离 (Demucs)：为特征提取提供纯净的“声学画布”。",
          "自监督内容 (HuBERT)：在无标注数据下解耦语义与音色。",
          "抗噪基频 (RMVPE)：在伴奏残留干扰下仍能精准捕捉旋律轨迹。",
          "检索增强 (FAISS)：通过检索训练集特征，弥补生成模型的“幻觉”。"
        ]
      }
    }
  },
  {
    id: 3,
    type: SlideType.IMAGE_CENTER,
    title: "2. 系统总体架构",
    subtitle: "基于 VITS 改进的端到端生成流水线",
    image: {
      src: "https://i.imgur.com/8u14pKV.jpeg", // 请在此处替换为您架构图的真实 URL
      caption: "图 1：系统包含预处理(分离/切片)、特征提取(F0/HuBERT)、生成模型训练(RVC)及检索推理(Index)四个阶段"
    }
  },
  {
    id: 4,
    type: SlideType.GRID_CARDS,
    title: "3. 关键技术模块详解",
    subtitle: "各模块的技术原理与选型依据",
    cards: [
      {
        title: "Demucs (混音分离)",
        description: "基于 U-Net 结构的波形域源分离模型。相比频谱掩蔽法，Demucs 能更好地保留人声相位信息，减少“水下音”伪影，为后续训练提供纯净样本。",
        icon: Music
      },
      {
        title: "HuBERT (内容表征)",
        description: "利用 Masked Prediction 任务进行自监督预训练。提取的 768 维特征向量能够表征语音的音素结构，而剥离说话人音色，实现“内容保持”。",
        icon: Mic2
      },
      {
        title: "RMVPE (基频提取)",
        description: "专门针对歌声优化的鲁棒音高估计器。采用多分辨率频谱输入与 GRU 循环网络，有效抵抗伴奏残留干扰，大幅降低八度错误率。",
        icon: BarChart2
      },
      {
        title: "FAISS (检索增强)",
        description: "Facebook AI 相似度搜索库。构建 IVF-Flat 索引，推理时实时检索训练集中的相似特征帧进行软融合，强制模型输出符合目标音色的纹理。",
        icon: Search
      }
    ]
  },
  {
    id: 5,
    type: SlideType.TWO_COLUMN,
    title: "4. 模型核心机制 (RVC v2)",
    subtitle: "结合 GAN 对抗训练与神经源-滤波器 (NSF) 理论",
    columns: {
      left: {
        title: "生成器与判别器架构",
        items: [
          "生成器 (Generator)：基于 VITS 框架，输入为 HuBERT 内容特征 + F0 曲线，通过流模型 (Flow) 预测波形。",
          "判别器 (Discriminator)：多尺度判别器 (MSD) + 多周期判别器 (MPD)，确保生成波形在高频细节和周期性上逼真。",
          "NSF 策略：显式输入 F0 作为激励源，使模型专注于学习滤波器（即共振峰与音色），解决高音发哑问题。"
        ]
      },
      right: {
        title: "多任务损失函数",
        items: [
          "L_recon (Mel 重建损失)：保证频谱包络的一致性。",
          "L_adv (对抗损失)：欺骗判别器，提升听感自然度。",
          "L_fm (特征匹配损失)：稳定 GAN 训练，防止模式崩溃。",
          "L_kl (KL 散度)：约束潜在变量分布，保证生成多样性。"
        ]
      }
    }
  },
  {
    id: 6,
    type: SlideType.GRID_CARDS,
    title: "5. 实验设置与环境",
    subtitle: "硬件规格、数据预处理与超参数配置",
    cards: [
      {
        title: "计算环境",
        description: "GPU: 4× NVIDIA RTX 4090D (24GB)。训练与推理主要使用单卡 (cuda:0)。软件栈: Ubuntu 22.04, CUDA 12.1, PyTorch 2.5.1。",
        icon: Cpu
      },
      {
        title: "数据集构建",
        description: "精选 14 首高品质干声/混音歌曲，总时长约 30 分钟。经切片处理生成 740 个音频片段。输入采样率统一重采样至 40kHz。",
        icon: Database
      },
      {
        title: "训练超参数",
        description: "Batch Size: 12, Epochs: 200。启用半精度 (FP16) 训练。加载 pretrained_v2 底模以加快收敛速度并提升低频质量。",
        icon: Settings
      },
      {
        title: "推理后处理",
        description: "输入一首 4 分钟歌曲。推理输出与原伴奏进行线性回混 (Linear Mixing)，并进行响度归一化防止削波失真。",
        icon: Layers
      }
    ]
  },
  {
    id: 7,
    type: SlideType.CODE_BLOCK,
    title: "6. 核心实现代码 (Linux CLI)",
    subtitle: "从数据处理到最终推理的完整命令流",
    code: `# 1. 混音分离 (使用 HtDemucs 模型)
python -m demucs -d cuda -n htdemucs --two-stems=vocals song_input.wav
# 输出: separated/htdemucs/song_input/vocals.wav

# 2. 数据集预处理 (重采样与切片)
python prepare_files.py --target_sr 40000 --train_set_path ./dataset --part 1

# 3. 特征提取 (F0 + Content)
# 提取基频 (使用 RMVPE)
python extract_f0_print.py --f0_method rmvpe --part 2
# 提取 HuBERT 特征
python extract_feature_print.py --device cuda:0 --part 3

# 4. 建立 FAISS 索引 (用于检索增强)
python train_index.py --root ./logs/my_experiment --index_algorithm IVF1024_Flat

# 5. 启动训练
python train_nsf_sim_cache_sid_load_pretrain.py -e my_experiment -sr 40k -f0 1 -bs 12 -te 200

# 6. 最终推理 (应用索引 index.pth)
python infer_cli.py 0 "vocals.wav" "final_output.wav" "weights/my_experiment.pth" "logs/my_experiment/index.pth" cuda:0 rmvpe`
  },
  {
    id: 8,
    type: SlideType.TWO_COLUMN,
    title: "7. 实验结果分析",
    subtitle: "收敛性分析与主观听感评估",
    columns: {
      left: {
        title: "训练收敛性",
        items: [
          "Loss 曲线：Mel 损失在 50 epoch 后快速下降，对抗损失在 150 epoch 趋于动态平衡。",
          "过拟合观察：由于数据集较小 (30min)，200 epoch 后出现轻微过拟合迹象，验证集 loss 略有回升。",
          "切片多样性：740 个切片覆盖了目标歌手的中高音区，但低音区样本略显不足。"
        ]
      },
      right: {
        title: "主观听感评估 (MOS)",
        items: [
          "音色相似度 (Timbre)：FAISS 索引启用后，音色还原度极高，尤其在长音部分。",
          "旋律准确性 (Pitch)：RMVPE 完美解决了快速转音时的“跑调”问题，无明显八度错误。",
          "清晰度 (Clarity)：咬字清晰，但在极高频部分（如齿音）存在轻微的电子啸叫声。",
          "融合度 (Mixing)：与原版伴奏回混后，整体听感自然，无明显的相位抵消问题。"
        ]
      }
    }
  },
  {
    id: 9,
    type: SlideType.GRID_CARDS,
    title: "8. 工程挑战与排错记录",
    subtitle: "实验过程中遇到的典型问题及解决方案",
    cards: [
      {
        title: "环境依赖冲突",
        description: "问题：系统级 ffmpeg 版本过低导致 torchaudio 读取失败。解决：使用 Conda 独立安装 ffmpeg 4.4+ 并配置 LD_LIBRARY_PATH。",
        icon: Terminal
      },
      {
        title: "CLI 参数解析错误",
        description: "问题：infer_cli.py 采用位置参数而非 argparse，导致参数错位。解决：阅读源码重新映射参数顺序：key, input, output, model, index...",
        icon: AlertTriangle
      },
      {
        title: "显存溢出 (OOM)",
        description: "问题：RMVPE 并行提取时，每个子进程独立加载模型占满 24G 显存。解决：限制 worker_num=1 或修改代码为共享模型推理。",
        icon: Cpu
      },
      {
        title: "Matplotlib 后端报错",
        description: "问题：Linux 无 GUI 环境下调用 plt.show() 导致崩溃。解决：在 import pyplot 前设置 matplotlib.use('Agg') 强制使用非交互后端。",
        icon: Code
      }
    ]
  },
  {
    id: 10,
    type: SlideType.TITLE,
    title: "9. 总结与未来展望",
    subtitle: "实验结论",
    content: [
      "成功验证了 Linux CLI 环境下端到端歌声转换的可行性。",
      "引入 FAISS 检索增强显著提升了模型的泛化能力与音色稳定性。",
      "未来方向：探索 So-VITS-SVC 5.0 架构，以及基于流式传输的实时转换系统。",
      "感谢聆听"
    ]
  }
];