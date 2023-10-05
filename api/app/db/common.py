async def async_commit_refresh(db, instance):
    """ASYNC Utility function to add an instance to the
    database, commit changes, and refresh the instance.
    """
    db.add(instance)
    await db.commit()
    await db.refresh(instance)


def sync_commit_refresh(db, instance):
    """SYNC Utility function to add an instance to the
    database, commit changes, and refresh the instance.
    """
    db.add(instance)
    db.commit()
    db.refresh(instance)
