/**
 * [calculateDamage used to calculate damage during an attack]
 * @param  {[type]} playerObject [description]
 * @return {[type]}              [description]
 */
function calculateDamage(attckingObject, defendingObject) {
	defendingObject.health -= attackingObject.attack;
}