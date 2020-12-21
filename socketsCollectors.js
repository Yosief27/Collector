function sockets(io, socket, data)
{
  socket.on('setupCollectors', function (d)
  {
    data.createRoom(d.roomId, d.playerCount, d.lang);
  })
  socket.on('collectorsLoaded', function (d)
  {
    socket.join(d.roomId);
    if (data.joinGame(d.roomId, d.playerId))
    {
      socket.emit('collectorsInitialize', {
        labels: data.getUILabels(d.roomId),
        players: data.getPlayers(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        placements: data.getPlacements(d.roomId)

      }
    );
  }
  });socket.on('updatePlayerName', function (d)
  {
    io.to(d.roomId).emit('updatePlayerName',
      data.updatePlayerName(d.roomId, d.playerId, d.playerName)
    );
  });
  socket.on('notifyPlayers', function (d)
  {
    io.to(d.roomId).emit('notifyPlayers',
      data.getPlayers(d.roomId)
    );
  });









  socket.on('collectorsDrawCard', function (d)
  {
    console.log('sockets drawCard' + d);
    io.to(d.roomId).emit('collectorsCardDrawn',
      data.drawCard(d.roomId, d.playerId)
    );

  });
  socket.on('collectorsBuyCard', function (d)
  {
    console.log('sockets collectorBuyCard');

    data.buyCard(d.roomId, d.playerId, d.card, d.cost, d.action)
    io.to(d.roomId).emit('collectorsCardBought', {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId)
    }
    );
  });
  socket.on('collectorsPlaceBottle', function (d)
  {

    console.log('sockets placeBottle');
    data.placeBottle(d.roomId, d.playerId, d.action, d.p, d.hand);

    console.log('sockets placeBottle after data.placeBottle');
    io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
  );
  });

}
module.exports = sockets;
