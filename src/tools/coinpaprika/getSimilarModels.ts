import { BaseChatModel } from "langchain/chat_models";
import { HumanMessage } from "langchain/schema";

export const getSimilarModels = async (model: BaseChatModel, question: string) => {
    const prompt = `Your task is to shortlist 5 models from this large list of models that may contain
    answer for the question asked by user. You can select models by entering model names separated by
    comma.
    
    Question: ${question}

    List of models with their descriptions:

    - get_coins_coin_id_events_response_items: Contains information about a coin event like date, name, description, etc.
    - get_coins_coin_id_exchanges_response_items: Contains information about an exchange where a coin is traded like id, name, trading volume, etc.
    - get_coins_coin_id_markets_response_items: Contains information about a market for a coin like exchange, trading pair, prices, quotes, etc.
    - get_coins_coin_id_ohlcv_historical_response_items: Contains OHLCV (open, high, low, close, volume) historical price data for a coin.
    - get_coins_coin_id_ohlcv_latest__response_items: Contains OHLCV price data for a coin for the latest full day.
    - get_coins_coin_id_ohlcv_today__response_items: Contains OHLCV price data for a coin for the current day.
    - get_coins_coin_id_twitter_response_items: Contains information about a Twitter post for a coin like date, content, likes, etc.
    - get_coins_response_items: Contains basic identity and metadata for a coin like id, name, rank, type, etc.
    - get_exchanges_exchange_id_markets_response_items: Contains information about a market on an exchange like trading pair, prices, volume, etc.
    - get_exchanges_response_items: Contains basic information about an exchange like id, name, volume, markets, etc.
    - get_global_response: Contains overview market data like total market cap, 24h volume, number of coins, etc.
    - get_key_info_response: Contains API key information like plan details, usage stats, etc.
    - get_price_converter_response: Contains currency conversion data like converted amount, exchange rates, etc.
    - get_search_response: Contains search results for currencies, exchanges, ICOs, people, tags matching a query.
    - get_tags_response_items: Contains information about a tag like name, description, coin/ICO count, etc.
    - get_tags_tag_id_response: Contains detailed information about a specific tag.
    - get_ticker_coin_id_response: Contains ticker data for a single coin like price, volume, market cap, etc.
    - get_ticker_response_items: Contains ticker data for multiple coins.
    - getCoinById_response: Contains detailed descriptive information about a single coin.
    - getContracts_response_items: Contains information about a blockchain contract like id, address, type.
    - getExchangeByID_response: Contains detailed information about a single exchange.
    - getExchanges_response_items: Contains basic information about multiple exchanges.
    - getPeopleById_response: Contains information about a person involved in crypto like bio, teams, links, etc.
    - getTickers_response_items: Contains ticker data for multiple coins.
    - getTickersById_response: Contains ticker data for a single coin.
    - getTickersHistoricalById_response_items: Contains historical OHLCV ticker data for a single coin.
    `

    const response = await model.generate([
        [
          new HumanMessage(prompt),
        ],
      ]);

    const generatedText = response.generations[0][0].text.trim();

    console.log(`\n🧬 Selected Models:\n${generatedText}`);

    return generatedText.split(',').map((model) => model.trim());
}