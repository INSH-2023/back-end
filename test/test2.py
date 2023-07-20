def two_by_two(animals):
    if len(animals) == 0:
        return False
    store = set()
    dict = {}
    for i in animals:
        if i in store:
            dict[i] = 2
        else:
            store.add(i)
    return dict

def two_by_two(animals):
    return {x:2 for x in animals if animals.count(x) > 1} if animals else False