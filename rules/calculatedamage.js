/**
 * [calculateDamage used to calculate damage during an attack]
 * @param  {[type]} attackingObject [description]
 * @param  {[type]} defendingObject [description]
 * @return {[type]}              [description]
 */
function calculateDamage(attackingObject, defendingObject) {
	defendingObject.hp -= attackingObject.attack;
}