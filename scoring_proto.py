

datescores=[]
for date in allDates:
    datescore=0
    for participant in date:
        #ocuupation=0 -> not time
        #occupation=1 -> free time
        #occupation=0<x<1 -> can be shifted

        #needed -> True if meeting cannot be performed without person., False if it can.
        datescore+=participant.occupation
        if participant.needed and participant.occupation == 0:
            datescore=0
            break #continue with next date
    datescores.append(datescore)
    if datescore == numberOfParticipants:
        break
    
bestDate=max(datescores)
