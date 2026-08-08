import type { ComponentType } from "react";
import { NetworkHyperEvm, type IconComponentProps } from "@web3icons/react";
import NetworkAbstract from "@web3icons/react/icons/networks/NetworkAbstract";
import NetworkApechain from "@web3icons/react/icons/networks/NetworkApechain";
import NetworkArbitrumOne from "@web3icons/react/icons/networks/NetworkArbitrumOne";
import NetworkAstar from "@web3icons/react/icons/networks/NetworkAstar";
import NetworkAurora from "@web3icons/react/icons/networks/NetworkAurora";
import NetworkAvalanche from "@web3icons/react/icons/networks/NetworkAvalanche";
import NetworkBase from "@web3icons/react/icons/networks/NetworkBase";
import NetworkBeam from "@web3icons/react/icons/networks/NetworkBeam";
import NetworkBerachain from "@web3icons/react/icons/networks/NetworkBerachain";
import NetworkBinanceSmartChain from "@web3icons/react/icons/networks/NetworkBinanceSmartChain";
import NetworkBitkubChain from "@web3icons/react/icons/networks/NetworkBitkubChain";
import NetworkBlast from "@web3icons/react/icons/networks/NetworkBlast";
import NetworkBob from "@web3icons/react/icons/networks/NetworkBob";
import NetworkBoba from "@web3icons/react/icons/networks/NetworkBoba";
import NetworkCelo from "@web3icons/react/icons/networks/NetworkCelo";
import NetworkChiliz from "@web3icons/react/icons/networks/NetworkChiliz";
import NetworkCitrea from "@web3icons/react/icons/networks/NetworkCitrea";
import NetworkConflux from "@web3icons/react/icons/networks/NetworkConflux";
import NetworkCronos from "@web3icons/react/icons/networks/NetworkCronos";
import NetworkCronosZkevm from "@web3icons/react/icons/networks/NetworkCronosZkevm";
import NetworkEthereum from "@web3icons/react/icons/networks/NetworkEthereum";
import NetworkEtherlink from "@web3icons/react/icons/networks/NetworkEtherlink";
import NetworkFantom from "@web3icons/react/icons/networks/NetworkFantom";
import NetworkFilecoin from "@web3icons/react/icons/networks/NetworkFilecoin";
import NetworkFlare from "@web3icons/react/icons/networks/NetworkFlare";
import NetworkFraxtal from "@web3icons/react/icons/networks/NetworkFraxtal";
import NetworkGnosis from "@web3icons/react/icons/networks/NetworkGnosis";
import NetworkHederaHashgraph from "@web3icons/react/icons/networks/NetworkHederaHashgraph";
import NetworkHemi from "@web3icons/react/icons/networks/NetworkHemi";
import NetworkImmutable from "@web3icons/react/icons/networks/NetworkImmutable";
import NetworkInk from "@web3icons/react/icons/networks/NetworkInk";
import NetworkIotaEvm from "@web3icons/react/icons/networks/NetworkIotaEvm";
import NetworkIotex from "@web3icons/react/icons/networks/NetworkIotex";
import NetworkKaia from "@web3icons/react/icons/networks/NetworkKaia";
import NetworkKava from "@web3icons/react/icons/networks/NetworkKava";
import NetworkLinea from "@web3icons/react/icons/networks/NetworkLinea";
import NetworkLukso from "@web3icons/react/icons/networks/NetworkLukso";
import NetworkMantaPacific from "@web3icons/react/icons/networks/NetworkMantaPacific";
import NetworkMantle from "@web3icons/react/icons/networks/NetworkMantle";
import NetworkMetisAndromeda from "@web3icons/react/icons/networks/NetworkMetisAndromeda";
import NetworkMode from "@web3icons/react/icons/networks/NetworkMode";
import NetworkMonad from "@web3icons/react/icons/networks/NetworkMonad";
import NetworkMoonbeam from "@web3icons/react/icons/networks/NetworkMoonbeam";
import NetworkMoonriver from "@web3icons/react/icons/networks/NetworkMoonriver";
import NetworkNibiru from "@web3icons/react/icons/networks/NetworkNibiru";
import NetworkOkex from "@web3icons/react/icons/networks/NetworkOkex";
import NetworkOptimism from "@web3icons/react/icons/networks/NetworkOptimism";
import NetworkPlasma from "@web3icons/react/icons/networks/NetworkPlasma";
import NetworkPolygon from "@web3icons/react/icons/networks/NetworkPolygon";
import NetworkPulsechain from "@web3icons/react/icons/networks/NetworkPulsechain";
import NetworkReya from "@web3icons/react/icons/networks/NetworkReya";
import NetworkRollux from "@web3icons/react/icons/networks/NetworkRollux";
import NetworkRonin from "@web3icons/react/icons/networks/NetworkRonin";
import NetworkRootstock from "@web3icons/react/icons/networks/NetworkRootstock";
import NetworkScroll from "@web3icons/react/icons/networks/NetworkScroll";
import NetworkSeiNetwork from "@web3icons/react/icons/networks/NetworkSeiNetwork";
import NetworkSoneium from "@web3icons/react/icons/networks/NetworkSoneium";
import NetworkSonic from "@web3icons/react/icons/networks/NetworkSonic";
import NetworkStable from "@web3icons/react/icons/networks/NetworkStable";
import NetworkTaiko from "@web3icons/react/icons/networks/NetworkTaiko";
import NetworkTelos from "@web3icons/react/icons/networks/NetworkTelos";
import NetworkUnichain from "@web3icons/react/icons/networks/NetworkUnichain";
import NetworkXLayer from "@web3icons/react/icons/networks/NetworkXLayer";
import NetworkXdc from "@web3icons/react/icons/networks/NetworkXdc";
import NetworkZircuit from "@web3icons/react/icons/networks/NetworkZircuit";
import NetworkZksync from "@web3icons/react/icons/networks/NetworkZksync";
import NetworkKatana from "@web3icons/react/icons/networks/NetworkKatana";
import NetworkMegaEth from "@web3icons/react/icons/networks/NetworkMegaEth";
import NetworkFlow from "@web3icons/react/icons/networks/NetworkFlow";
import NetworkRobinhood from "@web3icons/react/icons/networks/NetworkRobinhood";
type NetworkIconComponent = ComponentType<IconComponentProps>;

export const networkIconByChainId: Record<number, NetworkIconComponent> = {
  1: NetworkEthereum,
  10: NetworkOptimism,
  14: NetworkFlare,
  25: NetworkCronos,
  30: NetworkRootstock,
  40: NetworkTelos,
  41: NetworkTelos,
  42: NetworkLukso,
  50: NetworkXdc,
  56: NetworkBinanceSmartChain,
  66: NetworkOkex,
  96: NetworkBitkubChain,
  97: NetworkBinanceSmartChain,
  100: NetworkGnosis,
  130: NetworkUnichain,
  137: NetworkPolygon,
  143: NetworkMonad,
  146: NetworkSonic,
  169: NetworkMantaPacific,
  196: NetworkXLayer,
  250: NetworkFantom,
  252: NetworkFraxtal,
  288: NetworkBoba,
  295: NetworkHederaHashgraph,
  300: NetworkZksync,
  314: NetworkFilecoin,
  324: NetworkZksync,
  338: NetworkCronos,
  369: NetworkPulsechain,
  388: NetworkCronosZkevm,
  570: NetworkRollux,
  592: NetworkAstar,
  919: NetworkMode,
  988: NetworkStable,
  1030: NetworkConflux,
  1088: NetworkMetisAndromeda,
  1284: NetworkMoonbeam,
  1285: NetworkMoonriver,
  1329: NetworkSeiNetwork,
  1729: NetworkReya,
  1868: NetworkSoneium,
  2020: NetworkRonin,
  2221: NetworkKava,
  2222: NetworkKava,
  2741: NetworkAbstract,
  4114: NetworkCitrea,
  4337: NetworkBeam,
  4689: NetworkIotex,
  5000: NetworkMantle,
  5003: NetworkMantle,
  6900: NetworkNibiru,
  8217: NetworkKaia,
  8453: NetworkBase,
  8822: NetworkIotaEvm,
  9745: NetworkPlasma,
  10143: NetworkMonad,
  11124: NetworkAbstract,
  13371: NetworkImmutable,
  33139: NetworkApechain,
  34443: NetworkMode,
  42161: NetworkArbitrumOne,
  42220: NetworkCelo,
  42793: NetworkEtherlink,
  43113: NetworkAvalanche,
  43114: NetworkAvalanche,
  48900: NetworkZircuit,
  57073: NetworkInk,
  59141: NetworkLinea,
  59144: NetworkLinea,
  60808: NetworkBob,
  80094: NetworkBerachain,
  81457: NetworkBlast,
  84532: NetworkBase,
  88888: NetworkChiliz,
  167000: NetworkTaiko,
  421614: NetworkArbitrumOne,
  534351: NetworkScroll,
  534352: NetworkScroll,
  43111: NetworkHemi,
  3441006: NetworkMantaPacific,
  11155111: NetworkEthereum,
  11155420: NetworkOptimism,
  168587773: NetworkBlast,
  1313161554: NetworkAurora,
  747474: NetworkKatana,
  4326: NetworkMegaEth,
  747: NetworkFlow,
  31: NetworkRootstock,
  13473: NetworkImmutable,
  240: NetworkCronosZkevm,
  4663: NetworkRobinhood,
  999: NetworkHyperEvm
};
